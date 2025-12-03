import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

function getCallbackUrl(req: Request): string {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    return `${protocol}://${host}/api/auth/google/callback`;
}

export function registerGoogleOAuthRoutes(app: Express) {
    // Google OAuth 시작
    app.get("/api/auth/google", (req: Request, res: Response) => {
        const callbackUrl = getCallbackUrl(req);

        const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        googleAuthUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID!);
        googleAuthUrl.searchParams.set("redirect_uri", callbackUrl);
        googleAuthUrl.searchParams.set("response_type", "code");
        googleAuthUrl.searchParams.set("scope", "profile email");
        googleAuthUrl.searchParams.set("access_type", "offline");
        googleAuthUrl.searchParams.set("prompt", "consent");

        res.redirect(googleAuthUrl.toString());
    });

    // Google OAuth 콜백
    app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
        const code = req.query.code as string;

        if (!code) {
            res.status(400).json({ error: "code is required" });
            return;
        }

        try {
            const callbackUrl = getCallbackUrl(req);

            // 1. 코드를 토큰으로 교환
            const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    code,
                    client_id: GOOGLE_CLIENT_ID!,
                    client_secret: GOOGLE_CLIENT_SECRET!,
                    redirect_uri: callbackUrl,
                    grant_type: "authorization_code",
                }),
            });

            const tokenData = await tokenResponse.json();

            if (!tokenData.access_token) {
                throw new Error("Failed to get access token");
            }

            // 2. 사용자 정보 가져오기
            const userInfoResponse = await fetch(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.access_token}`,
                    },
                }
            );

            const userInfo = await userInfoResponse.json();

            if (!userInfo.id) {
                throw new Error("Failed to get user info");
            }

            // 3. 데이터베이스에 사용자 저장/업데이트
            const openId = `google_${userInfo.id}`;

            await db.upsertUser({
                openId,
                name: userInfo.name || null,
                email: userInfo.email || null,
                loginMethod: "google",
                lastSignedIn: new Date(),
            });

            // 4. 세션 토큰 생성
            const sessionToken = await sdk.createSessionToken(openId, {
                name: userInfo.name || "",
                expiresInMs: ONE_YEAR_MS,
            });

            // 5. 쿠키 설정
            const cookieOptions = getSessionCookieOptions(req);
            res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

            // 6. 홈으로 리디렉션
            res.redirect(302, "/");
        } catch (error) {
            console.error("[Google OAuth] Callback failed", error);
            res.status(500).json({ error: "Google OAuth callback failed" });
        }
    });
}

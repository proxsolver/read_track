/**
 * 인증 필수 래퍼 컴포넌트
 * 
 * 로그인하지 않은 사용자를 로그인 페이지로 리디렉션
 * 개발 모드에서는 인증 우회 가능
 */

import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
}

// 개발 모드에서 인증 우회 (로컬 테스트용)
const DEV_BYPASS_AUTH = import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

export default function AuthGuard({ children }: AuthGuardProps) {
    const [, setLocation] = useLocation();
    const { data: user, isLoading, error } = trpc.auth.me.useQuery(undefined, {
        // 개발 모드에서 인증 우회 시 쿼리 비활성화
        enabled: !DEV_BYPASS_AUTH,
    });

    useEffect(() => {
        // 개발 모드 우회 시 리디렉션 안 함
        if (DEV_BYPASS_AUTH) return;

        if (!isLoading && (!user || error)) {
            setLocation('/login');
        }
    }, [user, isLoading, error, setLocation]);

    // 개발 모드 우회
    if (DEV_BYPASS_AUTH) {
        return <>{children}</>;
    }

    // 로딩 중
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    // 인증되지 않음
    if (!user || error) {
        return null;
    }

    // 인증됨
    return <>{children}</>;
}

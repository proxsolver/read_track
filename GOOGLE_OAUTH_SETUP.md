# 🔐 Google OAuth 설정 완료!

## ✅ 추가된 파일

1. **`server/_core/googleOAuth.ts`** - Google OAuth 백엔드 로직
2. **`client/src/pages/Login.tsx`** - Google 로그인 버튼이 있는 페이지
3. **`.env.example`** - Google OAuth 환경 변수 템플릿

## 🔑 환경 변수 설정

### 로컬 개발 환경

루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Database Configuration
DATABASE_URL=mysql://user:password@localhost:3306/read_track

# Session Secret
SESSION_SECRET=some-random-secret-key-for-development

# Environment
NODE_ENV=development

# Server Port
PORT=5000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### Render.com (프로덕션)

Render Dashboard에서 환경 변수를 추가하세요:

1. **Dashboard** → 서비스 선택 (`read-track`)
2. **"Environment"** 탭 클릭
3. **"Add Environment Variable"** 클릭하여 다음 추가:

```
GOOGLE_CLIENT_ID = your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = your-google-client-secret-here
```

4. **"Save Changes"** 클릭

## ⚠️ 중요: Redirect URI 확인

Google Cloud Console에서 다음 Redirect URI가 등록되어 있는지 확인하세요:

### 등록해야 할 URI:

1. **로컬 개발용**:
   ```
   http://localhost:5000/api/auth/google/callback
   ```

2. **프로덕션용** (Render 앱 URL로 교체):
   ```
   https://your-app-name.onrender.com/api/auth/google/callback
   ```

### Redirect URI 추가 방법:

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 선택
3. **"API 및 서비스"** → **"사용자 인증 정보"**
4. 생성한 OAuth 2.0 클라이언트 ID 클릭
5. **"승인된 리디렉션 URI"** 섹션에서 URI 추가
6. **"저장"** 클릭

---

## 🚀 테스트 방법

### 로컬 테스트

1. `.env` 파일 생성 (위 내용 복사)
2. 데이터베이스 실행 확인
3. 서버 시작:
   ```bash
   pnpm run dev
   ```
4. 브라우저에서 `http://localhost:5000` 접속
5. Google 로그인 버튼 클릭
6. Google 계정으로 로그인
7. 홈 화면으로 리디렉션 확인

### 프로덕션 테스트

1. Render에 환경 변수 추가 (위 참조)
2. Google Cloud Console에서 프로덕션 Redirect URI 추가
3. 배포 대기 (자동 재배포)
4. 앱 URL 접속
5. Google 로그인 테스트

---

## 🎯 로그인 플로우

```
사용자 접속
    ↓
로그인 페이지 (/login)
    ↓
"Google로 로그인" 클릭
    ↓
/api/auth/google → Google 로그인 페이지로 리디렉션
    ↓
사용자가 Google 계정으로 인증
    ↓
Google → /api/auth/google/callback (코드 전달)
    ↓
서버: 코드를 토큰으로 교환
    ↓
서버: 사용자 정보 가져오기
    ↓
서버: 데이터베이스에 사용자 저장/업데이트
    ↓
서버: 세션 쿠키 설정
    ↓
홈 페이지로 리디렉션 (/)
    ↓
✅ 로그인 완료!
```

---

## ✅ 다음 단계

1. `.env` 파일 생성 (로컬 개발용)
2. Render에 환경 변수 추가 (프로덕션용)
3. Google Cloud Console에서 Redirect URI 추가
4. 코드 커밋 및 푸시
5. 배포 후 테스트!

---

## 🐛 문제 해결

### "redirect_uri_mismatch" 오류

→ Google Cloud Console에서 Redirect URI를 확인하세요. 정확히 일치해야 합니다.

### 로그인 후 에러 발생

→ Render Dashboard의 Logs 탭에서 오류 확인
→ 환경 변수가 올바르게 설정되었는지 확인

### 데이터베이스 연결 오류

→ `pnpm run db:push` 실행 (Render Shell에서)
→ DATABASE_URL 환경 변수 확인

---

Ready to deploy! 🚀

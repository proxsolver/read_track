# 📚 Read Track

독서 진행 상황을 추적하고 관리하는 웹 애플리케이션입니다.

## 🚀 기능

- 📖 읽고 있는 책 목록 관리
- 📊 일일 독서 진행률 체크
- 📈 책 완독 예상 날짜 계산
- 📝 책에 대한 간단한 메모 기능
- 📚 교보문고 API를 통한 책 정보 가져오기

## 🛠️ 기술 스택

### Frontend
- React 19 + TypeScript
- Vite (빌드 도구)
- TailwindCSS (스타일링)
- TanStack Query (데이터 페칭)
- tRPC (타입 안전 API)
- Radix UI (컴포넌트)

### Backend
- Node.js + Express
- tRPC Server
- Drizzle ORM
- MySQL

## 📦 로컬 개발 환경 설정

### 필수 요구사항

- Node.js 20+ 
- pnpm
- MySQL

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 데이터베이스 마이그레이션
pnpm run db:push

# 개발 서버 실행 (http://localhost:5000)
pnpm run dev

# 프로덕션 빌드
pnpm run build

# 프로덕션 실행
pnpm run start
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
DATABASE_URL=mysql://user:password@localhost:3306/read_track
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
PORT=5000
```

## 🌐 GitHub에서 무료로 배포하기

### 방법 1: Render.com (추천 ⭐)

Render는 GitHub 레포지토리와 연동하여 자동으로 배포할 수 있으며, 무료 플랜을 제공합니다.

#### 단계별 가이드:

1. **GitHub에 코드 푸시**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Render.com 가입**
   - [Render.com](https://render.com)에 접속
   - GitHub 계정으로 로그인

3. **Blueprint로 배포** (가장 쉬운 방법)
   - Dashboard에서 "New" → "Blueprint" 선택
   - GitHub 레포지토리 연결
   - `render.yaml` 파일이 자동으로 감지됨
   - "Apply" 클릭

4. **환경 변수 설정**
   - 자동으로 설정되지만, 필요시 추가 가능:
     - `SESSION_SECRET`: 랜덤 문자열 (자동 생성됨)
     - `DATABASE_URL`: MySQL 데이터베이스 URL (자동 연결됨)

5. **배포 완료!**
   - 몇 분 후 `https://your-app-name.onrender.com`에서 접속 가능
   - GitHub에 푸시할 때마다 자동으로 재배포됨

#### 참고사항:
- 무료 플랜은 15분간 활동이 없으면 자동으로 스핀다운됩니다
- 첫 방문 시 다시 시작하는데 30초 정도 걸릴 수 있습니다
- MySQL 데이터베이스도 무료로 제공됩니다 (90일간 활동이 없으면 삭제)

---

### 방법 2: Railway.app

Railway는 사용하기 매우 간단하며 $5 무료 크레딧을 제공합니다.

1. **GitHub에 코드 푸시**

2. **Railway 배포**
   - [Railway.app](https://railway.app) 접속
   - GitHub로 로그인
   - "New Project" → "Deploy from GitHub repo" 선택
   - 레포지토리 선택

3. **MySQL 데이터베이스 추가**
   - "New" → "Database" → "Add MySQL"

4. **환경 변수 설정**
   - 프로젝트 설정에서 Variables 추가:
     ```
     DATABASE_URL=${{MySQL.DATABASE_URL}}
     SESSION_SECRET=랜덤문자열
     NODE_ENV=production
     ```

5. **배포 명령어 설정**
   - Settings → Deploy에서:
     - Build Command: `pnpm install && pnpm run build`
     - Start Command: `pnpm run start`

---

### 방법 3: Vercel (Backend 제한적)

⚠️ **주의**: Vercel은 서버리스 함수로 작동하므로, 이 앱의 구조를 수정해야 합니다. Express 서버를 Vercel의 서버리스 함수로 변환해야 합니다.

**더 쉬운 방법은 Render나 Railway를 사용하는 것을 권장합니다.**

---

### 방법 4: Fly.io

1. **Fly CLI 설치**
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

2. **Fly.io 로그인**
```bash
fly auth login
```

3. **앱 초기화**
```bash
fly launch
```

4. **MySQL 데이터베이스 생성**
```bash
fly postgres create
fly postgres attach <postgres-app-name>
```

5. **환경 변수 설정**
```bash
fly secrets set SESSION_SECRET=your-secret-key
```

6. **배포**
```bash
fly deploy
```

---

## 🔒 보안 참고사항

프로덕션 배포 시 반드시 확인하세요:

1. **환경 변수 보호**: `.env` 파일을 절대 GitHub에 커밋하지 마세요
2. **강력한 비밀 키**: `SESSION_SECRET`는 충분히 긴 랜덤 문자열 사용
3. **데이터베이스 접근 제한**: 프로덕션 DB는 필요한 IP만 허용
4. **HTTPS 사용**: 대부분의 배포 플랫폼이 자동으로 제공

## 📝 데이터베이스 마이그레이션

배포 후 처음 한 번은 데이터베이스 테이블을 생성해야 합니다:

```bash
# Render.com이나 Railway에서 Shell 열기
pnpm run db:push
```

## 🐛 문제 해결

### 빌드 실패
- Node.js 버전 확인 (20 이상 필요)
- `pnpm-lock.yaml` 파일이 커밋되었는지 확인

### 데이터베이스 연결 실패
- `DATABASE_URL` 환경 변수가 올바르게 설정되었는지 확인
- MySQL 서비스가 실행 중인지 확인

### 앱이 시작되지 않음
- 로그를 확인하여 정확한 오류 메시지 확인
- `PORT` 환경 변수가 설정되었는지 확인

## 📄 라이선스

MIT

## 👥 기여

Pull Request를 환영합니다!

---

**Happy Reading! 📚✨**

---
description: Render.com에 배포하는 방법
---

# Render.com 배포 워크플로우

## 사전 요구사항
- GitHub 계정
- Render.com 계정 (무료)
- 코드가 GitHub에 푸시되어 있어야 함

## 배포 단계

### 1. GitHub에 코드 푸시
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Render.com 설정

1. [Render.com](https://render.com)에 접속하여 GitHub 계정으로 로그인
2. Dashboard에서 "New +" 버튼 클릭
3. "Blueprint" 선택

### 3. 레포지토리 연결

1. GitHub 레포지토리 연결 권한 부여
2. 배포할 레포지토리 선택 (read_track)
3. `render.yaml` 파일이 자동으로 감지됨
4. "Apply" 버튼 클릭

### 4. 환경 변수 확인

자동으로 설정되는 변수들:
- `DATABASE_URL`: MySQL 데이터베이스 연결 문자열
- `SESSION_SECRET`: 자동 생성된 비밀 키
- `NODE_ENV`: production
- `PORT`: 10000

필요시 추가 환경 변수 설정 가능

### 5. 배포 대기

- 첫 배포는 5-10분 정도 소요
- 빌드 로그를 실시간으로 확인 가능
- 녹색 "Live" 상태가 되면 배포 완료

### 6. 데이터베이스 초기화

배포 후 한 번만 실행:
1. Dashboard에서 서비스 선택
2. "Shell" 탭 클릭
3. 다음 명령어 실행:
```bash
pnpm run db:push
```

### 7. 접속 확인

- `https://your-app-name.onrender.com`에서 앱 확인
- 정상 작동하는지 테스트

## 자동 재배포

GitHub에 새로운 커밋을 푸시하면 자동으로 재배포됩니다:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

## 무료 플랜 제한사항

- 15분간 활동이 없으면 서비스가 스핀다운 (절전 모드)
- 다음 방문 시 다시 시작하는데 ~30초 소요
- 월 750시간 무료 (약 31일)
- MySQL 데이터베이스: 90일간 활동 없으면 삭제

## 문제 해결

### 빌드 실패
- Logs 탭에서 오류 메시지 확인
- `pnpm-lock.yaml` 파일이 커밋되었는지 확인
- Node.js 버전 확인 (render.yaml에서 설정)

### 앱이 시작되지 않음
- Environment 탭에서 환경 변수 확인
- 로그에서 데이터베이스 연결 오류 확인
- PORT 환경 변수가 10000으로 설정되어 있는지 확인

### 데이터베이스 연결 실패
- MySQL 서비스가 "Live" 상태인지 확인
- DATABASE_URL이 올바르게 연결되었는지 확인
- Shell에서 `pnpm run db:push`를 실행했는지 확인

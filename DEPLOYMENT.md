# 🚀 빠른 배포 가이드

## 가장 쉬운 방법: Render.com (추천)

### 1단계: GitHub에 코드 푸시
```bash
# 터미널에서 실행
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2단계: Render.com 가입 및 연결
1. https://render.com 접속
2. "Get Started for Free" 클릭
3. "Sign in with GitHub" 선택
4. GitHub 계정으로 로그인

### 3단계: Blueprint로 배포
1. Dashboard에서 "New +" 클릭
2. "Blueprint" 선택
3. GitHub 레포지토리 연결 허용
4. `read_track` 레포지토리 선택
5. `render.yaml` 자동 감지 확인
6. "Apply" 클릭

### 4단계: 배포 완료 대기
- 5-10분 정도 소요 (첫 배포)
- 빌드 로그 실시간 확인 가능
- 녹색 "Live" 상태가 되면 완료!

### 5단계: 데이터베이스 초기화
1. Dashboard에서 서비스 클릭
2. "Shell" 탭으로 이동
3. 아래 명령 실행:
```bash
pnpm run db:push
```

### 6단계: 접속!
- `https://your-app-name.onrender.com` 에서 확인
- 완료! 🎉

---

## 업데이트 배포 방법

코드를 수정한 후:
```bash
git add .
git commit -m "Update: 새로운 기능 추가"
git push origin main
```

→ 자동으로 재배포됩니다!

---

## 무료 플랜 참고사항
- ✅ 무료로 사용 가능
- ⏰ 15분 활동 없으면 절전 모드
- 🔄 다음 방문 시 ~30초 후 재시작
- 💾 MySQL DB도 무료 제공

---

## 문제 발생 시
1. Render Dashboard → Logs 확인
2. 환경 변수 설정 확인
3. `pnpm run db:push` 실행했는지 확인

더 자세한 내용은 `README.md` 참고!

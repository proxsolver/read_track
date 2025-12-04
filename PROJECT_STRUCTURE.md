# 📊 Read Track 프로젝트 구조 요약

```
read_track-1/
├── 📄 README.md                      # 프로젝트 소개
├── 📄 CODE_ANALYSIS_REPORT.md        # 🆕 코드 분석 보고서
│
├── 📁 dev-logs/                       # 🆕 개발 일지 폴더
│   ├── README.md                     # 일지 작성 가이드
│   ├── TEMPLATE.md                   # 일지 템플릿
│   └── 2025-12-04.md                 # 오늘의 개발 일지
│
├── 📁 client/                         # 프론트엔드
│   └── src/
│       ├── components/               # UI 컴포넌트
│       ├── pages/                    # 페이지
│       ├── contexts/                 # React Context
│       └── lib/                      # 유틸리티
│
├── 📁 server/                         # 백엔드
│   ├── _core/                        # 핵심 로직
│   │   └── index.ts                  # ✅ 메인 서버 (실제 사용)
│   ├── index.ts                      # ⚠️ 중복 (삭제 권장)
│   ├── db.ts                         # DB 함수
│   └── routers.ts                    # tRPC 라우터
│
├── 📁 drizzle/                        # 데이터베이스
│   └── schema.ts                     # DB 스키마
│
└── 📁 shared/                         # 공유 코드

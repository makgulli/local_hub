# LocalHub — 구미/경북 지역 정보 공유 커뮤니티

공공데이터(한국관광공사 TourAPI 4.0) 기반 지역 정보 공유 커뮤니티 프론트엔드입니다.
별도 백엔드 서버 없이 **Vue.js 3(Vite) 정적 SPA**로 동작하며, 게시판은 브라우저
`localStorage`에, 챗봇은 프론트엔드에서 OpenAI API를 직접 호출하는 구조입니다.

> 개발 의뢰서(RFP) `02_3일차_팀프로젝트_개발_의뢰서_비전공.pdf`, 실습기획서
> (`3일차_팀프로젝트_실습기획서`)의 MVP 정의, 그리고 팀에서 만든 디자인 시안
> `teamproject.html`(Tailwind CSS 기반 프로토타입)을 기준으로 구현되었습니다.

## 기술 스택

- Vue.js 3 + Vite
- Vue Router 4 (SPA 라우팅)
- Pinia (상태 관리 — 게시판/챗봇/토스트/페이플래너)
- Tailwind CSS 4 (`teamproject.html` 시안과 동일한 emerald/slate 팔레트)
- Font Awesome 6 (아이콘, CDN)
- OpenAI Chat Completions API (프론트엔드 직접 호출)
- Open-Meteo API (선택기능: 날씨 정보, 무료/키 불필요)
- 배포: Netlify

## 폴더 구조

```
src/
├── components/
│   ├── layout/         # 헤더, 푸터
│   ├── board/          # 비밀번호 확인 모달
│   ├── chatbot/         # 챗봇 위젯, 메시지 말풍선
│   ├── payplanner/       # 페이플래너 사이드 배너
│   └── common/           # 공용 UI (토스트 알림)
├── views/                # 라우트 단위 화면 (Home/BoardList/BoardDetail/BoardWrite/Weather)
├── stores/               # Pinia 스토어 (board, chat, toast, payPlanner)
├── services/             # 데이터/게시판/챗봇/날씨/페이플래너 비즈니스 로직
├── constants/            # contentTypeId, 선정 권역 정의 (SCHEMA.md 기준)
└── router/               # 라우트 정의

docs/
├── DATA_SOURCES.md     # 활용 데이터 목록 (기능명세서용, 출처·라이선스 포함)
└── DEV_PLAN_3DAYS.md   # 3일 일정 + Git 브랜치 전략

public/data/            # 제공받은 원본 JSON 8종을 넣는 위치 (gitignore 대상)
SCHEMA.md / SOURCE.md   # 원본 데이터 스키마 및 출처·라이선스 (참고용 사본)
```

## 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env
# .env 파일을 열어 VITE_OPENAI_API_KEY 값을 채워넣으세요.

# 3. 공공데이터 JSON 배치
# 회사에서 전달받은 구미_경북권_*.json 8개 파일을
# public/data/ 폴더에 그대로 넣어주세요. (public/data/README.md 참고)

# 4. 개발 서버 실행
npm run dev

# 5. 프로덕션 빌드
npm run build
```

## 구현 범위 대응표 (RFP III항 기준)

| RFP 요구 항목 | 구현 위치 |
|---|---|
| 제공 JSON 데이터 프론트엔드 연동 | `src/services/dataService.js` |
| 익명 게시판 CRUD (localStorage, 비밀번호 검증) | `src/services/boardService.js`, `src/views/Board*.vue` |
| 챗봇 (OpenAI 직접 호출, `.env` VITE_ 키 관리) | `src/services/chatService.js`, `src/components/chatbot/` |
| 채팅 UI (히스토리 유지, 모바일 대응, 플로팅, 전체화면 전환) | `src/components/chatbot/ChatWidget.vue` |
| 선택기능 — 날씨 정보 연동 (Open-Meteo) | `src/services/weatherService.js`, `src/views/WeatherView.vue` |
| 선택기능 — 페이플래너 (위치 기반 교통비 사이드 배너) | `src/services/payPlannerService.js`, `src/stores/payPlanner.js`, `src/components/payplanner/PayPlannerBanner.vue` |
| 활용 데이터 목록(출처·라이선스) | `docs/DATA_SOURCES.md` |

## `teamproject.html` 시안 대비 반영/변경 사항

`teamproject.html`은 Vue3(CDN)+Tailwind(CDN)로 만든 단일 파일 프로토타입입니다. 이번 작업에서는
그 디자인·화면 구조·게시글 스키마(작성자 닉네임 기반, 카테고리 없음)를 실제 Vite 프로젝트의
컴포넌트 구조로 그대로 옮기되, 아래 두 가지는 RFP 요구사항에 맞춰 의도적으로 다르게 구현했습니다.

| 항목 | teamproject.html 시안 | 이 프로젝트의 구현 | 사유 |
|---|---|---|---|
| 챗봇 AI 모델 | Google Gemini API (`gemini-3-flash-preview`) + Google 검색 그라운딩 토글 | **OpenAI Chat Completions API** | RFP III-3-가가 "OpenAI API를 직접 호출"하도록 명시적으로 지정 |
| API 키 관리 | 헤더의 설정(⚙️) 모달에서 사용자가 직접 키를 입력해 `localStorage`에 저장 | **`.env`(`VITE_OPENAI_API_KEY`)로 빌드 시점에 고정, UI에서 키 입력 불가** | RFP II-2 "API 키는 당사가 발급·제공"·"환경변수(VITE\_ 접두사)로 관리" 원칙과, 사용자가 직접 키를 입력하게 하면 회사가 발급한 키의 사용량·예산 통제가 불가능해지는 문제를 피하기 위함 |

나머지(홈 히어로, 명소 카드 그리드, "AI에 질문" 바로가기, 익명 소통망 테이블, 비밀번호 확인
모달, 토스트 알림, 챗봇 플로팅 UI 등)는 시안 구조를 그대로 따랐습니다. 날씨·페이플래너는
시안에는 없지만 실습기획서 MVP 정의에서 선정된 선택기능이라 유지하고, 동일한 톤(emerald/slate,
rounded-3xl)으로 새로 디자인해 추가했습니다.

## 배포 전 점검 (Netlify)

- [ ] `.env` 파일이 리포지토리에 포함되지 않았는지 확인 (`git status`)
- [ ] Netlify 빌드 명령 `npm run build`, 배포 폴더 `dist`
- [ ] Netlify 환경변수(Environment variables)에 `VITE_OPENAI_API_KEY` 등록
- [ ] OpenAI 키에 사용량 제한 + 결제 한도를 낮게 설정했는지 확인
- [ ] 배포된 URL에서 게시판 CRUD, 챗봇, 날씨, 페이플래너 기능이 실제로 동작하는지 확인

## 참고 문서

- `docs/DEV_PLAN_3DAYS.md` — Day1~3 체크리스트 및 Git 브랜치 전략
- `docs/DATA_SOURCES.md` — 기능명세서에 포함할 데이터 출처/라이선스 목록
- `SCHEMA.md` / `SOURCE.md` — 원본 공공데이터 스키마/출처 (프로젝트 문서 사본)

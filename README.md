# LocalHub — 구미/경북 지역 정보 공유 커뮤니티

공공데이터(한국관광공사 TourAPI 4.0) 기반 지역 정보 공유 커뮤니티 프론트엔드입니다.
별도 백엔드 서버 없이 **Vue.js 3(Vite) 정적 SPA**로 동작하며, 게시판은 브라우저
`localStorage`에, 챗봇은 프론트엔드에서 OpenAI API를 직접 호출하는 구조입니다.

> 개발 의뢰서(RFP) `02_3일차_팀프로젝트_개발_의뢰서_비전공.pdf` 및
> 실습기획서(`3일차_팀프로젝트_실습기획서`)의 MVP 정의를 기준으로 구현되었습니다.

## 기술 스택

- Vue.js 3 + Vite
- Vue Router 4 (SPA 라우팅)
- Pinia (상태 관리 — 게시판/챗봇)
- OpenAI Chat Completions API (프론트엔드 직접 호출)
- Open-Meteo API (선택기능: 날씨 정보, 무료/키 불필요)
- 배포: Netlify

## 폴더 구조

```
src/
├── components/
│   ├── layout/       # 헤더, 푸터
│   ├── board/        # 게시판 목록행, 페이지네이션, 비밀번호 모달
│   ├── chatbot/       # 챗봇 위젯, 메시지 말풍선
│   └── common/        # 공용 UI (물결 디바이더 등)
├── views/              # 라우트 단위 화면 (Home/BoardList/BoardDetail/BoardWrite/Weather)
├── stores/             # Pinia 스토어 (board, chat)
├── services/           # 데이터/게시판/챗봇/날씨 비즈니스 로직
├── constants/          # contentTypeId, 권역 정의 (SCHEMA.md 기준)
└── router/             # 라우트 정의

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
| 채팅 UI (히스토리 유지, 모바일 대응, 플로팅) | `src/components/chatbot/ChatWidget.vue` |
| 선택기능 — 날씨 정보 연동 (Open-Meteo) | `src/services/weatherService.js`, `src/views/WeatherView.vue` |
| 선택기능 — 페이플래너 (위치 기반 교통비 사이드 배너) | `src/services/payPlannerService.js`, `src/stores/payPlanner.js`, `src/components/payplanner/PayPlannerBanner.vue` |
| 활용 데이터 목록(출처·라이선스) | `docs/DATA_SOURCES.md` |

## 배포 전 점검 (Netlify)

- [ ] `.env` 파일이 리포지토리에 포함되지 않았는지 확인 (`git status`)
- [ ] Netlify 빌드 명령 `npm run build`, 배포 폴더 `dist`
- [ ] Netlify 환경변수(Environment variables)에 `VITE_OPENAI_API_KEY` 등록
- [ ] OpenAI 키에 사용량 제한 + 결제 한도를 낮게 설정했는지 확인
- [ ] 배포된 URL에서 게시판 CRUD, 챗봇, 날씨 기능이 실제로 동작하는지 확인

## 참고 문서

- `docs/DEV_PLAN_3DAYS.md` — Day1~3 체크리스트 및 Git 브랜치 전략
- `docs/DATA_SOURCES.md` — 기능명세서에 포함할 데이터 출처/라이선스 목록
- `SCHEMA.md` / `SOURCE.md` — 원본 공공데이터 스키마/출처 (프로젝트 문서 사본)

# LocalHub 3일 개발 일정 & Git 협업 전략

실습기획서 `5_WBS_간트차트` 탭 내용을 기준으로, 실제 이 리포지토리의 브랜치/커밋 단위로
매핑한 문서입니다. 팀 회의 시 각 Day 종료 전 체크리스트를 함께 확인하세요.

## 일정 개요

| Day | 단계 | 주요 산출물 |
|---|---|---|
| Day 1 | 기획 + 설계 | 요구사항 분석(MoSCoW), MVP 정의서, 와이어프레임, 데이터/API 명세 |
| Day 2 | 개발 | Vue3 SPA 세팅, 게시판 CRUD, 챗봇, 선택기능(날씨) 구현 |
| Day 3 | 배포 + 테스트 + 문서화 + 발표준비 | Netlify 배포, 통합 테스트, 기능명세서/WBS 정리, 발표 PPT |

납기: **2026-07-16(목) 15:00** — 모든 산출물(리포지토리, 배포 URL, 기능명세서, WBS, 발표자료) 제출.

---

## Day 1 — 기획 · 설계

- [ ] RFP 전체 정독 및 MoSCoW 요구사항 분석 확정 (`docs/` 또는 발표자료에 반영)
- [ ] 선정 권역 확정: **구미/경북**
- [ ] MVP 정의: Must / Should / Won't 확정, 선택기능 최소 1개 선정 → **날씨 정보 연동**
- [ ] 와이어프레임 검토 (RFP 참고4, 이 리포지토리의 화면 구성과 1:1 대응됨)
- [ ] 팀 디자인 시안(`docs/design-reference/teamproject.html`, Tailwind CSS 프로토타입) 검토 및 실제 컴포넌트 반영
- [ ] `SCHEMA.md`, `SOURCE.md` 기준 데이터 구조/라이선스 팀 공유
- [ ] 리포지토리 초기 세팅 (본 스캐폴드) 팀원 전체 clone 및 `npm install` 확인

## Day 2 — 개발

- [ ] `feature/board` 브랜치: 게시판 목록/상세/작성/수정/삭제 (localStorage CRUD)
- [ ] `feature/chatbot` 브랜치: OpenAI 연동 + 대화 히스토리 + 플로팅 UI
- [ ] `feature/weather` 브랜치: 선택기능(날씨) 연동
- [ ] `feature/payplanner` 브랜치: 선택기능(페이플래너 - 위치 기반 교통비 사이드 배너) 연동
- [ ] 실제 JSON 데이터 파일을 `public/data/`에 배치 후 게시판/챗봇 연동 확인
- [ ] 각 기능 브랜치 → `develop`으로 PR 및 코드리뷰 후 머지

## Day 3 — 배포 · 테스트 · 문서화 · 발표준비

- [ ] `develop` → `main` 머지, Netlify 연동 배포
- [ ] 배포 URL 접속하여 필수 기능 전체 동작 확인 (체크리스트는 `README.md` "배포 전 점검" 참고)
- [ ] `.env` 파일이 리포지토리에 포함되지 않았는지 최종 확인 (`git status`, `.gitignore`)
- [ ] 기능명세서(PDF/DOCX) 작성 — `docs/DATA_SOURCES.md` 내용 포함
- [ ] WBS 최종본 정리 및 제출
- [ ] 발표 PPT 제작 및 리허설

---

## Git 브랜치 전략 (팀 프로젝트용 최소 규칙)

```
main        - 배포 가능한 안정 버전 (Netlify가 이 브랜치를 배포 대상으로 사용)
develop     - 기능 통합 브랜치 (팀원들이 이 브랜치를 기준으로 feature 분기)
feature/*   - 기능 단위 작업 브랜치 (예: feature/board, feature/chatbot, feature/weather)
```

**작업 흐름**
1. `develop`에서 `feature/작업명` 브랜치 생성
2. 작업 후 커밋 → 원격 push
3. `develop`으로 Pull Request 생성 → 팀원 1명 이상 리뷰 후 머지
4. Day 3에 `develop` → `main` 머지 시에는 팀 전체가 합의한 시점에만 진행

**커밋 메시지 컨벤션 (예시)**
```
feat: 게시글 작성 폼 구현
fix: 비밀번호 검증 로직 오류 수정
style: 헤더 반응형 레이아웃 조정
docs: 데이터 출처 문서 업데이트
chore: vue-router, pinia 의존성 추가
```

**절대 커밋하지 않는 것**
- `.env` (OpenAI API 키)
- `public/data/*.json` (원본 제공 데이터 — 팀 내부 전달 채널로만 공유)
- `node_modules/`, `dist/`

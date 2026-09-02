# Notion 기반 견적서 웹 뷰어 MVP 개발 로드맵

영업 담당자가 Notion에 입력한 견적서를, 클라이언트가 로그인 없이 웹에서 확인하고 PDF로 저장한다.

## 개요

**Notion 견적서 웹 뷰어**는 견적서 공개 링크를 전달받은 B2B 클라이언트(구매 담당자·의사결정권자)를 위한 **로그인 없는 읽기 전용 견적서 뷰어**로 다음 기능을 제공합니다:

- **견적서 조회 (F001)**: Notion Quotes DB에서 견적서 단건 데이터를 조회하여 렌더링
- **견적 항목 렌더링 (F002)**: Notion Items DB에서 연결된 항목(품목·수량·단가·설명)을 리스트로 표시하고 소계/총액 자동 계산
- **견적서 요약 표시 (F003)**: 고객명·총 금액·유효기한·상태·비고를 한눈에 파악 가능한 요약 영역으로 제공
- **PDF 다운로드 (F004)**: 화면에 렌더링된 견적서를 html2canvas + jsPDF로 PDF 변환 및 다운로드
- **반응형 레이아웃 (F005)**: 모바일/데스크톱 화면 크기에 맞춘 자동 레이아웃 조정
- **조회 실패 안내 (F006)**: 존재하지 않음 / 비공개 / 유효기한 만료 등 사유별 안내 메시지 표시

### 아키텍처 원칙

- **별도 DB 없음**: Notion API 조회 결과를 읽기 전용으로 매핑 (애플리케이션은 무상태)
- **서버 전용 Notion 접근**: `NOTION_API_KEY`는 서버 컴포넌트/서버 전용 모듈에서만 사용하며 클라이언트 번들에 절대 노출하지 않음
- **인증 없음**: 모든 진입은 견적서별 공개 링크(`/quotes/[id]`)를 통해서만 이루어짐
- **RSC 우선**: 데이터 조회는 Server Component에서, 상호작용(PDF 다운로드·테마 토글)만 Client Component로 분리

### 현재 코드베이스 상태 (2026-09-02 기준)

| 영역 | 현황 |
|------|------|
| 프레임워크 | Next.js 16.3.2 / React 19.2.8 / TypeScript 5 / Tailwind CSS 4 설치 완료 |
| UI 컴포넌트 | `components/ui/`에 button, card, input, label, sonner, tooltip 6종만 존재 |
| 라우트 | `app/page.tsx`(안내용 랜딩), `app/login/`(MVP 범위 밖 — 제거 대상) |
| 미설치 의존성 | `@notionhq/client`, `html2canvas`, `jspdf` |
| 미존재 디렉토리 | `/tasks`, `/types`, `/lib/notion`, `/app/quotes` |

---

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `docs/ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `007`이라면 `006`과 `005`를 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **Notion API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

---

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

- **Task 001: 프로젝트 라우팅 구조 및 환경 설정 구축** - 우선순위
  - `app/quotes/[id]/page.tsx` 견적서 상세 라우트 골격 생성 (Next.js 16 비동기 `params` 규약 준수)
  - `app/quotes/[id]/loading.tsx`, `app/quotes/[id]/error.tsx`, `app/quotes/[id]/not-found.tsx` 특수 파일 생성
  - `app/error/page.tsx` 오류 안내 전용 페이지 골격 생성 (`?reason=` 쿼리로 사유 구분)
  - MVP 범위 밖 코드 정리: `app/login/` 및 `components/login-form.tsx` 제거
  - `app/page.tsx`를 "링크로 접속 안내" 최소 랜딩으로 유지, 루트 `layout.tsx`에 견적서 뷰어용 메타데이터 반영
  - `.env.example` 작성 (`NOTION_API_KEY`, `NOTION_QUOTES_DB_ID`, `NOTION_ITEMS_DB_ID`) 및 `.gitignore`에 `.env.local` 포함 확인
  - **완료 기준**: `npm run dev` 실행 후 `/quotes/test-id`, `/error` 접속 시 빈 껍데기 페이지가 200으로 렌더링되고 `npm run build`·`npm run lint` 무오류 통과

- **Task 002: 타입 정의 및 Notion 스키마 매핑 설계**
  - `types/quote.ts` — `Quote` 인터페이스 정의 (id, title, clientName, amount, validUntil, notes, status)
  - `types/item.ts` — `Item` 인터페이스 정의 (id, quoteId, name, qty, unitPrice, description) 및 소계 파생 타입
  - `types/error.ts` — `QuoteErrorReason` 유니온 타입 정의 (`NOT_FOUND` | `PRIVATE` | `EXPIRED` | `FETCH_FAILED`)
  - `types/notion.ts` — Notion 페이지 property → 도메인 타입 매핑 규약 정의 (title/rich_text/number/date/select/relation 프로퍼티별 추출 시그니처)
  - Notion Quotes/Items DB 프로퍼티명 상수화 (`lib/notion/schema.ts`, 구현 없이 상수·타입만)
  - 조회 결과 판별 유니온 정의: `QuoteResult = { ok: true; quote: Quote; items: Item[] } | { ok: false; reason: QuoteErrorReason }`
  - **완료 기준**: 모든 타입이 `tsc --noEmit`(빌드) 통과, 런타임 코드 0줄, PRD 데이터 모델의 모든 필드가 타입에 1:1 반영

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- **Task 003: 공통 컴포넌트 라이브러리 및 디자인 시스템 구축**
  - shadcn CLI로 필수 컴포넌트 추가: `npx shadcn@latest add table badge separator skeleton alert`
  - `lib/format.ts` — 통화(KRW) 포맷터, 날짜(`ko-KR`) 포맷터, 수량 포맷터 유틸 구현
  - `lib/dummy-data.ts` — PRD 데이터 모델을 만족하는 더미 Quote 1건 + Item 5건 이상 생성 (긴 품목명·긴 비고·항목 0건 등 엣지 케이스 포함)
  - 견적서 상태 배지 컴포넌트 `components/quote/status-badge.tsx` (공개/비공개/만료 variant)
  - 라이트/다크 모드 색상 토큰 검증 및 인쇄(PDF 캡처) 대비 대비비 확인
  - **완료 기준**: 각 컴포넌트가 더미 데이터로 렌더링되며 다크모드 전환 시 깨짐 없음

- **Task 004: 견적서 상세 페이지 UI 구현 (더미 데이터)**
  - `components/quote/quote-summary.tsx` — 고객명·총 금액·유효기한·상태·비고 요약 카드 (F003)
  - `components/quote/quote-items-table.tsx` — 품목·수량·단가·설명·소계 테이블, 모바일에서는 카드 리스트로 전환 (F002, F005)
  - `components/quote/quote-total.tsx` — 항목 소계 합계 및 총 견적 금액 표시 영역
  - `components/quote/quote-document.tsx` — PDF 캡처 대상이 될 견적서 전체 래퍼 (고정 ref 지정 가능한 구조)
  - `components/quote/download-pdf-button.tsx` — 버튼 UI만 구현 (클릭 시 동작은 Task 008에서 연결)
  - `app/quotes/[id]/page.tsx`에서 더미 데이터로 전체 페이지 조립
  - **완료 기준**: `/quotes/dummy` 접속 시 완성된 견적서 화면이 표시되고 360px/768px/1280px 뷰포트에서 가로 스크롤 없이 정상 렌더링

- **Task 005: 오류 안내 페이지 및 로딩 상태 UI 완성**
  - `components/error/error-notice.tsx` — 오류 사유별 아이콘·제목·설명 메시지 매핑 컴포넌트 (F006)
  - 사유별 카피 확정: 견적서 없음 / 비공개 상태 / 유효기한 만료 / 일시적 조회 실패 (각각 발신자에게 재확인 요청 안내 포함)
  - `app/error/page.tsx`에서 `?reason=` 값을 읽어 해당 메시지 렌더링, 알 수 없는 값은 기본 메시지로 폴백
  - `app/quotes/[id]/loading.tsx` — Skeleton 기반 견적서 로딩 UI 구현
  - `app/quotes/[id]/error.tsx` — 예상치 못한 렌더링 오류 시 재시도 버튼 포함 폴백 UI
  - 오류 페이지 반응형 레이아웃 적용 (F005)
  - **완료 기준**: `/error?reason=NOT_FOUND|PRIVATE|EXPIRED|FETCH_FAILED` 4가지 URL이 각각 다른 안내 메시지를 표시하고 모바일에서 정상 렌더링

### Phase 3: 핵심 기능 구현

- **Task 006: Notion API 연동 레이어 구축** - 우선순위
  - `@notionhq/client` 설치 및 `lib/notion/client.ts` 서버 전용 클라이언트 초기화 (`import "server-only"` 적용)
  - `lib/notion/mappers.ts` — Notion 페이지 property → `Quote` / `Item` 변환 함수 구현 (누락·타입 불일치 프로퍼티 안전 폴백)
  - `lib/notion/queries.ts` — `getQuoteById(id)`, `getItemsByQuoteId(quoteId)` 구현 (Items는 `quoteId` relation 필터 + 정렬 적용)
  - 오류 정규화: Notion `object_not_found`/권한 오류 → `NOT_FOUND`, 그 외 예외 → `FETCH_FAILED`로 매핑
  - 상태·유효기한 판정 로직: `status`가 비공개면 `PRIVATE`, `validUntil` 경과 시 `EXPIRED` (타임존 `Asia/Seoul` 기준 일 단위 비교)
  - `getQuoteResult(id)` 통합 함수로 `QuoteResult` 판별 유니온 반환
  - **완료 기준**: 실제 Notion DB에서 견적서 1건과 항목 전체가 도메인 타입으로 정확히 매핑되고, 존재하지 않는 ID 요청 시 예외 없이 `NOT_FOUND` 반환
  - **테스트**: Playwright MCP로 실제 Notion 데이터가 주입된 페이지의 네트워크/콘솔 오류 부재 및 `NOTION_API_KEY` 클라이언트 번들 미노출 검증

- **Task 007: 견적서 상세 페이지 데이터 연동 및 상태 분기**
  - `app/quotes/[id]/page.tsx`를 Server Component로 전환하여 `getQuoteResult(id)` 호출 (F001)
  - 더미 데이터를 실제 Notion 조회 결과로 전면 교체, `lib/dummy-data.ts`는 개발·테스트 전용으로만 유지
  - 조회 실패 시 사유를 담아 `/error?reason=...`으로 `redirect()` 처리 (F006)
  - 항목 소계 및 총액 계산 로직 서버 측 확정 (`amount` 필드와 항목 합계 불일치 시 표시 정책 결정 및 적용)
  - `generateMetadata`로 견적서 제목·고객명 기반 동적 메타데이터 생성 (공개 링크 공유 시 OG 표시)
  - Notion API 실패 시 Sonner 토스트 안내 연결
  - **완료 기준**: 유효한 Notion 견적서 ID로 접속 시 실제 데이터가 요약·항목·총액에 정확히 표시되고, 4가지 실패 케이스가 모두 오류 안내 페이지로 전환
  - **테스트**: Playwright MCP로 정상/없음/비공개/만료 4개 시나리오 E2E 검증

- **Task 008: PDF 다운로드 기능 구현**
  - `html2canvas`, `jspdf` 설치 및 `lib/pdf.ts` 생성 유틸 구현
  - `components/quote/download-pdf-button.tsx`를 Client Component로 전환, `quote-document` ref 캡처 → A4 비율 PDF 변환 (F004)
  - 파일명 규칙 적용: `견적서_{고객명}_{YYYYMMDD}.pdf` (파일명 사용 불가 문자 치환)
  - 캡처 전용 스타일 처리: 다크모드일 때도 흰 배경 강제, 버튼·테마 토글 등 비인쇄 요소 제외
  - 생성 중 로딩 상태(버튼 disabled + 스피너) 및 완료/실패 Sonner 토스트 처리
  - 항목이 많아 1페이지를 초과하는 경우 다중 페이지 분할 처리
  - **완료 기준**: 다운로드된 PDF에 요약·전체 항목·총액이 잘림 없이 포함되며, 다크모드에서도 가독 가능한 결과물 생성
  - **테스트**: Playwright MCP로 다운로드 이벤트 발생·파일명 규칙·다중 페이지 케이스 검증

- **Task 008-1: 핵심 기능 통합 테스트**
  - Playwright MCP로 PRD 사용자 여정 전체 플로우 E2E 테스트 (링크 접속 → 로딩 → 렌더링 → PDF 다운로드)
  - 엣지 케이스 검증: 항목 0건, 항목 50건 이상, 금액 0원, 비고 미입력, 초장문 품목명, 유효기한 당일
  - 오류 핸들링 검증: 잘못된 ID 형식, Notion API 타임아웃, 네트워크 차단 상태
  - 반응형 검증: 360px / 768px / 1280px 뷰포트 스냅샷 및 가로 스크롤 부재 확인
  - 다크모드/라이트모드 양쪽에서 전체 플로우 재현
  - 콘솔 에러·경고 0건 및 하이드레이션 불일치 부재 확인
  - **완료 기준**: 정의된 전체 시나리오가 실패 없이 통과하고 재현 절차가 `/tasks/008-1-*.md`에 기록됨

### Phase 4: 최적화 및 배포

- **Task 009: 성능 최적화 및 캐싱 전략 구현**
  - Notion 조회 결과 캐싱 적용 (`revalidate` 기반 ISR 또는 `unstable_cache`, 견적서 갱신 반영 주기 결정)
  - Quote·Items 조회 병렬화 및 불필요한 재조회 제거
  - PDF 라이브러리(`html2canvas`, `jspdf`) 동적 import로 초기 번들에서 분리
  - 폰트·아이콘 로딩 최적화 및 번들 사이즈 측정 (`next build` 리포트 기준 목표치 설정)
  - Lighthouse 측정: 모바일 Performance / Accessibility / Best Practices 90점 이상 목표
  - Notion API rate limit 대응 재시도·백오프 처리
  - **완료 기준**: 견적서 상세 페이지 초기 로드 LCP 2.5초 이내, Lighthouse 목표 점수 달성

- **Task 010: 접근성·품질 보증 및 Vercel 배포**
  - 접근성 점검: 테이블 헤더 연결, 버튼 aria-label, 포커스 가시성, 색상 대비 WCAG AA 충족
  - `robots`/`noindex` 정책 결정 및 적용 (견적서 공개 링크의 검색엔진 색인 차단 여부)
  - Vercel 프로젝트 연결, 환경변수(`NOTION_API_KEY`, DB ID) 등록, 프로덕션 배포
  - 배포 환경 스모크 테스트: 실제 공개 링크로 조회·PDF 다운로드 전 과정 검증
  - 오류 로깅·모니터링 구성 (Vercel Logs 기반 Notion 조회 실패율 추적)
  - `README.md` 갱신: 환경변수 설정법, Notion DB 프로퍼티 요구사항, 로컬 실행 절차 문서화
  - **완료 기준**: 프로덕션 URL에서 전체 사용자 여정이 정상 동작하고 신규 개발자가 README만으로 로컬 환경 구동 가능
  - **테스트**: Playwright MCP로 프로덕션 URL 대상 스모크 테스트 수행

---

## 테스트 전략 (Playwright MCP)

Phase 3 이후 모든 작업은 다음 시나리오 그룹을 기준으로 검증합니다.

| 그룹 | 시나리오 | 관련 Task |
|------|----------|-----------|
| **정상 플로우** | 유효 링크 접속 → 요약·항목·총액 렌더링 → PDF 다운로드 성공 | 007, 008, 008-1 |
| **조회 실패** | 존재하지 않는 ID / 비공개 상태 / 유효기한 만료 / API 실패 → 사유별 안내 페이지 전환 | 006, 007 |
| **데이터 엣지 케이스** | 항목 0건, 대량 항목, 금액 0원, 비고 미입력, 초장문 텍스트 | 008-1 |
| **반응형** | 360 / 768 / 1280px 뷰포트 레이아웃 및 가로 스크롤 부재 | 004, 005, 008-1 |
| **테마** | 라이트/다크 모드 전체 플로우 및 PDF 결과물 가독성 | 008, 008-1 |
| **보안** | 클라이언트 번들에 `NOTION_API_KEY` 미노출, 서버 전용 모듈 경계 준수 | 006 |
| **회귀** | 콘솔 에러 0건, 하이드레이션 불일치 부재, `npm run lint`·`npm run build` 무오류 | 전체 |

---

## 진행 현황

| Phase | 상태 | 포함 Task |
|-------|------|-----------|
| Phase 1: 애플리케이션 골격 구축 | 대기 | Task 001, 002 |
| Phase 2: UI/UX 완성 | 대기 | Task 003, 004, 005 |
| Phase 3: 핵심 기능 구현 | 대기 | Task 006, 007, 008, 008-1 |
| Phase 4: 최적화 및 배포 | 대기 | Task 009, 010 |

> 다음 착수 작업: **Task 001: 프로젝트 라우팅 구조 및 환경 설정 구축**

# Notion 기반 견적서 웹 뷰어 MVP PRD 생성 메타 프롬프트

## 목표
다음 요구사항을 기반으로 **Notion 데이터 기반 견적서 웹 뷰어** MVP PRD 문서를 작성하는 프롬프트입니다.

## 사용자 컨텍스트
- **기술 스택**: Next.js 16.3.2, React 19.2.8, TypeScript 5, Tailwind CSS 4, shadcn/ui
- **아키텍처**: App Router (서버/클라이언트 컴포넌트 분리)
- **인증**: 향후 추가 예정 (현재는 public)
- **데이터 소스**: Notion Database (Notion API v2)

---

## 메타 프롬프트

```
당신은 SaaS 제품 기획자입니다.

다음 요구사항을 기반으로 **MVP PRD(Product Requirements Document)**를 작성하세요:

### 요구사항
1. **데이터 소스**: Notion Database에서 견적서 데이터를 조회
2. **웹 표현**: 견적서를 읽기 좋은 웹 UI로 표시
3. **PDF 다운로드**: 웹 페이지의 견적서를 PDF 파일로 다운로드
4. **클라이언트 확인**: 클라이언트가 공유된 링크를 통해 접근 가능
5. **MVP 범위**: 최소 기능 집합으로 시작 (인증, 버전 관리 등은 phase 2)

### 기술 제약
- **프레임워크**: Next.js 16.3.2, React 19.2.8
- **언어**: TypeScript (strict mode)
- **스타일링**: Tailwind CSS 4, shadcn/ui
- **데이터베이스**: Notion API (v2, JavaScript SDK 사용)
- **라이브러리**: react-to-pdf 또는 html2canvas + jsPDF (PDF 다운로드)

### PRD 작성 지침

#### 1. 제품 개요 (Product Overview)
- 1줄 요약: "Notion 데이터 기반 견적서를 웹에서 보고 PDF로 내보내는 서비스"
- 문제 정의: Notion에서 입력한 견적서를 매번 확인하기 어려움 → 전용 웹 링크로 공유 가능하게
- 솔루션: Notion API 연동 웹 뷰어

#### 2. 핵심 기능 (Core Features)
다음 기능만 MVP에 포함:
- **Notion 데이터 조회**: 특정 Database ID에서 견적서 목록 조회
- **견적서 상세 보기**: 선택한 견적서의 내용 표시
- **필드 매핑**: Notion의 다음 필드를 표시
  - 견적서 번호 (Title)
  - 클라이언트명 (Text)
  - 총액 (Number)
  - 항목 목록 (Relation 또는 Table)
  - 유효 기간 (Date)
  - 비고 (Text)
- **PDF 다운로드**: "PDF로 저장" 버튼으로 현재 견적서를 PDF 파일로 다운로드
- **공개 링크 공유**: `?quote=<notion-page-id>` URL 파라미터로 특정 견적서 조회
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원

#### 3. 사용자 플로우 (User Flow)
```
클라이언트
  ↓
공개 링크 접속 (https://example.com/quotes?id=<notion-page-id>)
  ↓
견적서 내용 표시 (Notion 데이터 동적 로드)
  ↓
[선택] PDF 다운로드 버튼 클릭
  ↓
PDF 생성 및 다운로드
```

#### 4. 기술 아키텍처 (Technical Architecture)

**Backend (Next.js API Route)**
- 엔드포인트: `GET /api/quotes/:id`
- 역할:
  - Notion API 호출 (인증 토큰 보안)
  - 데이터 변환 및 검증
  - 캐싱 (선택사항: 30분)

**Frontend (React Component)**
- 페이지: `app/quotes/[id]/page.tsx` (동적 라우트)
- 컴포넌트 분리:
  - `<QuoteHeader />` — 견적서 기본 정보
  - `<QuoteItems />` — 항목 목록 표시
  - `<QuoteSummary />` — 총액, 유효 기간 등
  - `<PDFDownloadButton />` — PDF 다운로드 버튼

**PDF 생성**
- 라이브러리: `html2canvas` + `jsPDF` 또는 `react-pdf-renderer`
- 트리거: 클라이언트 사이드 (브라우저에서 렌더링)
- 파일명: `quote_<number>_<date>.pdf`

#### 5. 데이터 모델 (Data Model)

**Notion Database 스키마 (예시)**
```
Page (見積書)
├── Title: 見積書番号 (Text) — "EST-2026-001"
├── ClientName (Text) — "클라이언트A"
├── Amount (Number) — 1500000
├── Items (Relation) → Item Page
├── ValidUntil (Date) — "2026-09-30"
├── Notes (Text) — "협의 사항 없음"
└── Status (Select) — "Draft" | "Approved" | "Declined"
```

**API Response 형식**
```typescript
{
  id: string;
  number: string;           // 견적서 번호
  clientName: string;
  amount: number;           // 총액
  currency: "KRW" | "USD";
  items: {
    name: string;
    qty: number;
    unitPrice: number;
    subtotal: number;
  }[];
  validUntil: string;       // ISO 8601 date
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 6. MVP 스코프 (What's NOT Included)
- ❌ 사용자 인증 (phase 2)
- ❌ 견적서 수정/생성 (read-only)
- ❌ 결제 정보 (향후 확장)
- ❌ 서명 기능
- ❌ 다국어 지원 (한국어만)
- ❌ 버전 관리 (최신 데이터만)
- ❌ 감사 로그

#### 7. 보안 고려사항 (Security)
- Notion API 토큰은 **환경 변수**에 저장 (`.env.local`)
- API Route에서만 Notion 호출 (클라이언트에서 직접 호출 금지)
- 쿼리 파라미터 검증: Notion Page ID 형식 확인
- CORS 설정 (필요시)
- Rate limiting 고려 (Notion API 호출 제한)

#### 8. UI/UX 지침
- **디자인**: shadcn/ui 컴포넌트 + Tailwind CSS
- **색상**: Tailwind 기본 팔레트 (accent 색상은 프로젝트 테마 색상)
- **폰트**: Geist 폰트 (프로젝트 기본값)
- **다크 모드**: next-themes로 자동 지원 (optional)
- **접근성**: WCAG 2.1 AA (shadcn/ui 컴포넌트 기본값)
- **로딩 상태**: 스켈레톤 로더 또는 로딩 표시
- **에러 처리**: Sonner 토스트로 알림

#### 9. 성능 요구사항
- 초기 로드: < 2초
- Notion API 응답: < 1초 (캐싱 고려)
- PDF 생성: < 3초
- 모바일 최적화: Core Web Vitals 준수

#### 10. 배포 및 인프라
- **호스팅**: Vercel (Next.js 최적화)
- **환경 변수**: `.env.local` 및 Vercel Secrets
- **빌드**: `npm run build` (NextJS 빌드 최적화)
- **모니터링**: Vercel 내장 분석 (선택사항)

#### 11. 테스트 전략 (MVP 단계)
- ✅ API Route 테스트: Notion 데이터 변환 로직
- ✅ 컴포넌트 테스트: 견적서 렌더링
- ❌ E2E 테스트: phase 2
- ❌ 성능 테스트: phase 2

#### 12. 마일스톤 및 일정 (Timeline)
**Phase 1: MVP (1-2주)**
- Notion API 통합 ✓
- 견적서 조회 페이지 ✓
- PDF 다운로드 ✓
- 공개 링크 공유 ✓

**Phase 2: 확장 (향후)**
- 사용자 인증 및 권한 관리
- 견적서 생성/수정 기능
- 템플릿 관리
- 분석 대시보드

#### 13. 성공 지표 (Success Metrics)
- ✅ 공개 링크를 통한 견적서 접근 가능
- ✅ PDF 다운로드 성공률 > 95%
- ✅ 초기 로드 시간 < 2초
- ✅ 모바일에서 정상 표시

---

### 작성 요구사항
1. **형식**: Markdown (이 파일과 같은 포맷)
2. **분량**: 4-6페이지 (A4 기준)
3. **시각 자료**: 필요시 ASCII 플로우 다이어그램 추가
4. **기술 정확성**: Notion API, Next.js 16, React 19 최신 방식 반영
5. **실현 가능성**: 2주 이내 구현 가능한 범위로 작성
6. **언어**: 한국어 (코드 및 기술용어는 영어)

---

### 제공할 정보
- 프로젝트 GitHub 링크: (필요시)
- Notion Database ID: (클라이언트가 제공)
- 디자인 가이드: 기존 프로젝트의 shadcn/ui 테마 참고

### 질문이 있을 시
1. Notion Database 필드 구조가 명확하지 않다면, 샘플 JSON 요청
2. PDF 포맷에 대한 구체적인 요구사항 (헤더, 푸터, 로고 등) 확인
3. 클라이언트 인증 필요 여부 확인
```

---

## 이 메타 프롬프트 사용 방법

1. **Claude Code에서 실행**:
   ```bash
   $ cd docs
   $ cat PRD_PROMPT.md | xargs -0 claude
   ```

2. **Claude 웹 (claude.ai)에서 사용**:
   - 이 파일 내용을 복사
   - Claude 챗에 붙여넣기
   - "이 메타 프롬프트를 기반으로 PRD를 작성해줘"

3. **결과 저장**:
   ```bash
   # Claude 응답을 prd_output.md로 저장
   # 그 후 프로젝트에 병합
   ```

---

## 주요 특징

✅ **프로젝트 컨텍스트 반영**
- Next.js 16, React 19, TypeScript, Tailwind CSS
- shadcn/ui 컴포넌트 라이브러리
- App Router 구조

✅ **명확한 MVP 범위**
- Notion 조회 (read-only)
- 웹 표시
- PDF 다운로드

✅ **구현 지향적**
- API 스키마 명시
- 컴포넌트 분리 계획
- 라이브러리 추천

✅ **확장성**
- Phase 2 계획 포함
- 보안, 성능, 테스트 고려

---

## 다음 단계

1. **Notion Database ID** 준비
2. Claude를 이용한 **상세 PRD 생성**
3. **Task 생성** 및 개발 시작
4. **GitHub 이슈 등록** 및 추적


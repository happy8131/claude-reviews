# Notion 기반 견적서 웹 뷰어 MVP
## Product Requirements Document (PRD)

**작성일**: 2026-08-29  
**버전**: 1.0  
**상태**: MVP 정의 완료  
**제품 리더**: Claude Code  

---

## 1. Executive Summary

### 제품 개요
**Notion 기반 견적서를 웹에서 보고 PDF로 내보낼 수 있는 전용 뷰어 서비스**

Notion Database에 입력된 견적서를 매번 Notion에서 확인하는 불편함을 해결하기 위해, 클라이언트가 공유된 웹 링크를 통해 견적서를 확인하고 즉시 PDF로 다운로드할 수 있는 웹 애플리케이션입니다.

### 핵심 가치 제안
- 📊 **Notion 중앙화**: 모든 견적서 데이터를 Notion에서 관리 (SSOT - Single Source of Truth)
- 🔗 **공개 링크**: 특정 견적서를 URL로 공유 가능 (로그인 불필요, MVP 단계)
- 📄 **즉시 PDF**: 웹에서 보는 그대로 PDF 다운로드
- 📱 **반응형**: 모바일/태블릿/데스크톱 모두 지원
- ⚡ **빠른 로드**: 초기 로드 < 2초, 최적화된 성능

### 성공 정의
- ✅ 공개 링크를 통한 견적서 조회 가능
- ✅ PDF 다운로드 성공률 > 95%
- ✅ 모바일/데스크톱 모두 정상 렌더링
- ✅ 초기 페이지 로드 < 2초

---

## 2. Problem Statement

### 현재 상황 분석

#### 2.1 문제점
1. **Notion 직접 접근 필요**: 클라이언트가 견적서를 보려면 Notion 계정이 필요하거나 공유 링크가 복잡
2. **형식 고정성 부족**: Notion의 기본 레이아웃으로는 견적서 전용 형식 제공 불가
3. **PDF 내보내기 불편**: 매번 Notion에서 수동으로 PDF 변환 필요
4. **디자인 제어 어려움**: 회사 브랜드에 맞는 레이아웃 커스터마이징 어려움
5. **분석 불가**: 클라이언트가 견적서를 언제 확인했는지 알 수 없음

#### 2.2 영향
- 프로페셔널한 이미지 저하
- 클라이언트 확인 절차 번거로움
- 운영 리소스 낭비 (PDF 변환 작업)

#### 2.3 대상 사용자
- **주 사용자**: 영업 담당자 (견적서 생성/공유)
- **클라이언트**: 기업 또는 개인 클라이언트 (견적서 확인)
- **경영진**: 견적서 데이터 대시보드 (Phase 2)

---

## 3. Solution Overview

### 3.1 솔루션 개요
Notion API를 통해 견적서 데이터를 실시간으로 조회하고, 전용 웹 뷰어에서 렌더링한 후 PDF로 다운로드할 수 있는 Next.js 기반 웹 애플리케이션입니다.

### 3.2 주요 컴포넌트

```
┌─────────────────────────────────────────────────────┐
│            Notion Database (견적서 데이터)           │
└────────────────────┬────────────────────────────────┘
                     │ Notion API
                     ▼
        ┌────────────────────────┐
        │  Next.js Backend       │
        │  └─ API Route: /api    │
        │     /quotes/:id        │
        └────────────┬───────────┘
                     │ REST API
                     ▼
        ┌────────────────────────┐
        │  React Frontend        │
        │  └─ Quotes Viewer      │
        │  └─ PDF Generator      │
        └────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    [웹 표시]            [PDF 다운로드]
  (html2canvas)           (jsPDF)
```

### 3.3 주요 특징
| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 공개 링크 조회 | `?id=<notion-page-id>`로 특정 견적서 조회 | P0 |
| Notion 실시간 동기 | API 호출 시 최신 데이터 표시 | P0 |
| 웹 렌더링 | 견적서 전용 UI로 표시 | P0 |
| PDF 다운로드 | 웹 화면을 PDF로 변환 다운로드 | P0 |
| 반응형 디자인 | 모바일/태블릿/데스크톱 지원 | P0 |
| 접근성 | WCAG 2.1 AA 준수 | P1 |
| 캐싱 | Notion API 응답 캐싱 (30분) | P2 |

---

## 4. User Personas & Use Cases

### 4.1 User Persona

#### Persona 1: 영업 담당자 (Sarah, 35세)
- **목표**: 견적서를 전문적으로 클라이언트에게 공유
- **문제점**: 매번 PDF 변환에 시간 소요
- **핵심 니즈**: 클릭 한 번에 공유 가능한 링크, 자동 PDF 생성

#### Persona 2: 클라이언트 (John, 42세)
- **목표**: 받은 견적서를 편하게 확인 및 검토
- **문제점**: Notion 접근 어려움, 형식이 부자연스러움
- **핵심 니즈**: 깔끔한 웹 UI, 쉬운 PDF 다운로드

#### Persona 3: 경영진 (CEO)
- **목표**: 활성 견적서 현황 파악
- **문제점**: Notion 데이터를 직접 분석하기 어려움
- **핵심 니즈**: 견적서 통계/분석 (Phase 2)

### 4.2 Core Use Cases

#### UC-1: 견적서 공개 링크 생성 및 공유
```
사용자: 영업 담당자
선행 조건: Notion Database에 견적서 데이터 존재

1. Notion에서 견적서 생성 및 저장
2. 견적서의 Notion Page ID 확인
3. 웹 뷰어 링크 생성: https://example.com/quotes?id=<page-id>
4. 이메일/카톡으로 클라이언트에게 공유

결과: 클라이언트가 링크를 통해 견적서 확인 가능
```

#### UC-2: 견적서 웹에서 조회
```
사용자: 클라이언트
선행 조건: 공개 링크 수신

1. 이메일의 링크 클릭
2. 웹 페이지 로드 (Notion에서 데이터 동적 조회)
3. 견적서 내용 확인 (항목, 가격, 유효 기간 등)
4. 컴포넌트 축소/확대 또는 인쇄 미리보기

결과: 깔끔한 UI에서 견적서 검토 완료
```

#### UC-3: PDF 다운로드
```
사용자: 클라이언트
선행 조건: 견적서를 웹에서 보고 있음

1. "PDF로 저장" 버튼 클릭
2. 시스템이 HTML을 PDF로 변환
3. 브라우저가 파일 다운로드 시작

결과: 견적서가 PDF 파일로 저장됨 (quote_EST-2026-001_2026-08-29.pdf)
```

---

## 5. Core Features & Specifications

### 5.1 Feature List (MVP 범위)

| # | 기능 | 설명 | 완료 기준 |
|---|------|------|---------|
| F1 | Notion API 통합 | API 토큰으로 특정 Database 조회 | 테스트 완료 |
| F2 | 견적서 조회 API | `/api/quotes/:id` 엔드포인트 | 응답 스키마 확정 |
| F3 | 동적 라우팅 | `app/quotes/[id]/page.tsx` 페이지 | URL 파라미터 처리 |
| F4 | 견적서 렌더링 | Notion 데이터를 웹 UI로 표시 | 모든 필드 표시 확인 |
| F5 | PDF 다운로드 | html2canvas + jsPDF로 변환 | 파일 다운로드 확인 |
| F6 | 반응형 디자인 | Tailwind CSS로 모바일/데스크톱 대응 | 모든 디바이스에서 테스트 |
| F7 | 에러 처리 | 404, 네트워크 에러 등 사용자 안내 | 에러 페이지 구현 |
| F8 | 로딩 상태 | Skeleton 또는 로딩 표시 | UX 개선 확인 |

### 5.2 Not in MVP (Phase 2+)

- ❌ 사용자 인증/권한 관리 (모든 링크는 공개)
- ❌ 견적서 생성/수정 (Notion에서만 편집)
- ❌ 서명 기능
- ❌ 결제 정보
- ❌ 다국어 지원
- ❌ 감사 로그
- ❌ 버전 관리
- ❌ 분석 대시보드

---

## 6. User Flow & Wireframes

### 6.1 High-Level User Flow

```
Start
  │
  ├─→ 영업 담당자
  │   └─→ [Notion] 견적서 입력
  │   └─→ Page ID 복사
  │   └─→ 링크 생성 (https://example.com/quotes?id=<id>)
  │   └─→ 이메일 발송
  │
  ├─→ 클라이언트
  │   └─→ 이메일의 링크 클릭
  │   └─→ 웹 페이지 로드
  │   └─→ Notion 데이터 표시 (API 호출)
  │   └─→ 견적서 내용 확인
  │   ├─→ 이메일/카톡으로 회신
  │   └─→ PDF 다운로드 (선택사항)
  │       └─→ 저장
  │
  └─→ End
```

### 6.2 Wireframe: 견적서 뷰어 페이지

```
┌──────────────────────────────────────────────────────────────┐
│ Logo | Notion 아이콘 | 다크 모드 토글                [PDF 저장]│
├──────────────────────────────────────────────────────────────┤
│                                                                │
│ 💼 견적서                                                      │
│ ─────────────────────────────────────────────────────────────  │
│                                                                │
│ 견적서 번호: EST-2026-001                                      │
│ 클라이언트: Acme Corporation                                   │
│ 발행일: 2026-08-29                                            │
│ 유효기간: 2026-09-30                                          │
│                                                                │
│ 📋 항목 목록                                                   │
│ ─────────────────────────────────────────────────────────────  │
│ | 항목명         | 수량 | 단가      | 소계       |             │
│ |─────────────────────────────────────────────|              │
│ | 웹사이트 개발  | 1   | 3,000,000 | 3,000,000  |            │
│ | 유지보수      | 12  | 500,000   | 6,000,000  |            │
│ | 호스팅        | 12  | 100,000   | 1,200,000  |            │
│                                                                │
│ 💰 요약                                                        │
│ ─────────────────────────────────────────────────────────────  │
│ 소계:         ₩10,200,000                                      │
│ 세금 (10%):   ₩1,020,000                                       │
│ 총액:         ₩11,220,000                                      │
│                                                                │
│ 📝 비고                                                        │
│ ─────────────────────────────────────────────────────────────  │
│ 50% 선금, 나머지는 완료 시 납부                                │
│ 변동사항은 이메일로 공지                                       │
│                                                                │
│                                          [PDF로 저장] [인쇄]  │
└──────────────────────────────────────────────────────────────┘
```

### 6.3 Flow: API 호출 및 렌더링

```
클라이언트 브라우저
  │
  └─→ GET /quotes?id=abc123
      │
      ├─→ [Next.js 서버]
      │   └─→ 파라미터 검증
      │   └─→ API Route: /api/quotes/abc123 호출
      │
      └─→ [API Route]
          └─→ Notion API 호출 (Bearer Token)
          └─→ 데이터 변환 (Notion 형식 → App 스키마)
          └─→ JSON 응답
              │
              └─→ [React Component]
                  └─→ QuoteHeader
                  └─→ QuoteItems
                  └─→ QuoteSummary
                  └─→ PDFDownloadButton
                  │
                  └─→ 웹 페이지 렌더링 ✓
```

---

## 7. Technical Architecture

### 7.1 Technology Stack

| 계층 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **Framework** | Next.js | 16.3.2 | 풀스택 프레임워크 (App Router) |
| **Language** | TypeScript | 5 | 타입 안전성 |
| **Frontend** | React | 19.2.8 | UI 컴포넌트 |
| **Styling** | Tailwind CSS | 4 | 유틸리티 기반 스타일링 |
| **Components** | shadcn/ui | - | 접근성 높은 UI 컴포넌트 |
| **Icons** | Lucide React | - | 벡터 아이콘 |
| **PDF** | html2canvas + jsPDF | latest | HTML → PDF 변환 |
| **Data Source** | Notion API | v2 | 견적서 데이터 |
| **Environment** | Node.js | 20+ | 런타임 |

### 7.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Hosting)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Next.js 16 (App Router)                      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │  Server-side Rendering                              │  │
│  │  ├─ app/quotes/[id]/page.tsx (SSR)                 │  │
│  │  ├─ app/layout.tsx (Root Layout)                    │  │
│  │  └─ API Routes                                      │  │
│  │     └─ app/api/quotes/[id]/route.ts                │  │
│  │                                                        │  │
│  │  Client-side Components                              │  │
│  │  ├─ <QuoteHeader />                                 │  │
│  │  ├─ <QuoteItems />                                  │  │
│  │  ├─ <QuoteSummary />                                │  │
│  │  ├─ <PDFDownloadButton />                           │  │
│  │  └─ <ErrorBoundary />                               │  │
│  │                                                        │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│                     │ Notion API v2                         │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     Environment Variables (.env.local)              │  │
│  │     ├─ NOTION_API_KEY                               │  │
│  │     ├─ NOTION_DATABASE_ID                           │  │
│  │     └─ NEXT_PUBLIC_BASE_URL                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
                    ┌─────────────────┐
                    │  Notion Cloud   │
                    │  Database       │
                    └─────────────────┘
```

### 7.3 File Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout (providers)
│   ├── page.tsx                    # Home page
│   ├── globals.css                 # Global styles
│   ├── quotes/
│   │   └── [id]/
│   │       └── page.tsx            # Quote viewer (SSR)
│   └── api/
│       └── quotes/
│           └── [id]/
│               └── route.ts        # Quote API endpoint
│
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── quote/
│   │   ├── QuoteHeader.tsx         # Quote title, number, client
│   │   ├── QuoteItems.tsx          # Items table
│   │   ├── QuoteSummary.tsx        # Total, tax, amount
│   │   ├── PDFDownloadButton.tsx   # PDF export button
│   │   └── QuoteViewer.tsx         # Main wrapper
│   │
│   └── common/
│       ├── ErrorFallback.tsx       # Error boundary
│       ├── LoadingSkeletons.tsx    # Skeleton loaders
│       └── NotFound.tsx            # 404 component
│
├── lib/
│   ├── utils.ts                    # cn() helper
│   ├── notion-client.ts            # Notion API 클라이언트
│   ├── notion-parser.ts            # Notion 데이터 변환
│   ├── types.ts                    # TypeScript types/interfaces
│   └── constants.ts                # 상수
│
├── hooks/
│   ├── useQuote.ts                 # Quote data fetching
│   └── usePDF.ts                   # PDF generation
│
├── types/
│   └── index.ts                    # Type definitions
│
└── public/
    └── favicon.ico
```

---

## 8. Data Models & APIs

### 8.1 Notion Database Schema (예시)

**Database Name**: Quotes (견적서)

| 필드명 | Type | 설명 |
|--------|------|------|
| Title | Title | 견적서 번호 (e.g., "EST-2026-001") |
| ClientName | Rich Text | 클라이언트명 |
| ClientEmail | Email | 클라이언트 이메일 |
| Amount | Number | 총액 (원화 기준) |
| Currency | Select | 통화 (KRW, USD 등) |
| Items | Relation | Item Database와 연결 |
| ValidUntil | Date | 유효 기간 |
| Notes | Rich Text | 비고 및 특수 조건 |
| Status | Select | 상태 (Draft, Approved, Declined) |
| CreatedAt | Created Time | 생성 시간 |
| UpdatedAt | Last Edited Time | 수정 시간 |

**Related Database**: Items (항목)

| 필드명 | Type | 설명 |
|--------|------|------|
| Name | Title | 항목명 (e.g., "웹사이트 개발") |
| Qty | Number | 수량 |
| UnitPrice | Number | 단가 (원화) |
| Subtotal | Formula | 소계 (Qty × UnitPrice) |
| Description | Rich Text | 항목 설명 |

### 8.2 API Response Schema

#### GET /api/quotes/[id]

**Request**:
```typescript
GET /api/quotes/abc123xyz
```

**Success Response (200 OK)**:
```json
{
  "id": "abc123xyz",
  "number": "EST-2026-001",
  "clientName": "Acme Corporation",
  "clientEmail": "john@acme.com",
  "amount": 11220000,
  "currency": "KRW",
  "items": [
    {
      "id": "item1",
      "name": "웹사이트 개발",
      "qty": 1,
      "unitPrice": 3000000,
      "subtotal": 3000000,
      "description": "풀스택 웹 개발"
    },
    {
      "id": "item2",
      "name": "유지보수",
      "qty": 12,
      "unitPrice": 500000,
      "subtotal": 6000000,
      "description": "월간 유지보수"
    }
  ],
  "subtotal": 9000000,
  "tax": 900000,
  "totalAmount": 11220000,
  "validUntil": "2026-09-30",
  "notes": "50% 선금, 나머지는 완료 시 납부",
  "status": "approved",
  "createdAt": "2026-08-29T10:30:00Z",
  "updatedAt": "2026-08-29T10:30:00Z"
}
```

**Error Response (404 Not Found)**:
```json
{
  "error": "Quote not found",
  "code": "QUOTE_NOT_FOUND",
  "message": "해당 견적서를 찾을 수 없습니다."
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "error": "Failed to fetch quote",
  "code": "NOTION_API_ERROR",
  "message": "Notion API 호출에 실패했습니다. 잠시 후 다시 시도하세요."
}
```

### 8.3 TypeScript Interfaces

```typescript
// lib/types.ts

export interface Quote {
  id: string;
  number: string;
  clientName: string;
  clientEmail?: string;
  amount: number;
  currency: 'KRW' | 'USD' | 'JPY';
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  validUntil: string; // ISO 8601
  notes?: string;
  status: 'draft' | 'approved' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  description?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  code?: string;
  message?: string;
}
```

### 8.4 Notion API Integration

```typescript
// lib/notion-client.ts

import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getQuoteFromNotion(pageId: string): Promise<Quote> {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    const props = page.properties;

    // Notion 데이터를 Quote 타입으로 변환
    const quote: Quote = {
      id: page.id,
      number: extractTitle(props.Title),
      clientName: extractText(props.ClientName),
      amount: extractNumber(props.Amount),
      currency: extractSelect(props.Currency) as 'KRW' | 'USD' | 'JPY',
      items: [],
      validUntil: extractDate(props.ValidUntil),
      notes: extractRichText(props.Notes),
      status: extractSelect(props.Status) as 'draft' | 'approved' | 'declined',
      createdAt: page.created_time,
      updatedAt: page.last_edited_time,
      subtotal: 0,
      tax: 0,
      totalAmount: 0,
    };

    // Items 관계 데이터 조회 (별도 API 호출)
    quote.items = await getQuoteItems(props.Items);

    // 계산된 값
    quote.subtotal = quote.items.reduce((sum, item) => sum + item.subtotal, 0);
    quote.tax = Math.round(quote.subtotal * 0.1);
    quote.totalAmount = quote.subtotal + quote.tax;

    return quote;
  } catch (error) {
    console.error(`Failed to fetch quote ${pageId}:`, error);
    throw new Error('NOTION_API_ERROR');
  }
}

// Helper functions
function extractTitle(property: any): string {
  return property.title?.[0]?.plain_text || '';
}

function extractText(property: any): string {
  return property.rich_text?.[0]?.plain_text || '';
}

function extractNumber(property: any): number {
  return property.number || 0;
}

function extractSelect(property: any): string {
  return property.select?.name || '';
}

function extractDate(property: any): string {
  return property.date?.start || '';
}

function extractRichText(property: any): string {
  return property.rich_text?.map((t: any) => t.plain_text).join('') || '';
}
```

---

## 9. UI/UX Specifications

### 9.1 Design System

#### Color Palette (Tailwind CSS)
- **Primary**: `blue-600` / `blue-500`
- **Accent**: `blue-400`
- **Background**: `white` (light) / `gray-950` (dark)
- **Text**: `gray-900` (light) / `gray-50` (dark)
- **Muted**: `gray-500` / `gray-400`
- **Success**: `green-600`
- **Error**: `red-600`
- **Warning**: `yellow-600`

#### Typography
- **Font**: Geist (next/font)
- **Heading 1**: 32px bold (md: 40px)
- **Heading 2**: 24px bold (md: 28px)
- **Heading 3**: 20px bold
- **Body**: 16px regular (md: 16px)
- **Small**: 14px regular
- **Caption**: 12px regular

#### Spacing
- **Base unit**: 4px
- **Common gaps**: 4, 8, 12, 16, 24, 32, 48 (8의 배수)
- **Padding**: 16px (모바일), 24px (데스크톱)

### 9.2 Component Specs

#### Header Component
```tsx
<QuoteHeader>
  - 견적서 번호 (큰 텍스트)
  - 클라이언트명
  - 발행일/유효기간
  - 상태 배지 (Draft/Approved/Declined)
</QuoteHeader>
```

**Responsive**:
- Mobile: 세로 정렬, 작은 폰트
- Desktop: 가로 정렬, 큰 폰트

#### Items Table
```tsx
<QuoteItems>
  - 테이블 형식 (항목명, 수량, 단가, 소계)
  - 반응형: 모바일에서는 카드로 전환
  - 행 호버 시 배경색 변경
  - 포커스 가능 (keyboard navigation)
</QuoteItems>
```

#### Summary Section
```tsx
<QuoteSummary>
  - 소계 금액
  - 세금 (10%)
  - **최종 금액** (강조)
  - 비고 섹션
</QuoteSummary>
```

#### PDF Download Button
```tsx
<PDFDownloadButton>
  - "PDF로 저장" 텍스트
  - 다운로드 아이콘
  - 클릭 시 로딩 스피너 표시
  - 완료 시 토스트 알림
</PDFDownloadButton>
```

**States**:
- **Idle**: 기본 상태
- **Loading**: 스피너 표시
- **Success**: 토스트 "PDF가 저장되었습니다"
- **Error**: 토스트 "PDF 생성에 실패했습니다"

### 9.3 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 640px | 단열 (Stack) |
| Tablet | 640px - 1024px | 2열 (일부) |
| Desktop | > 1024px | 전체 레이아웃 |

### 9.4 Accessibility (A11y)

- ✅ WCAG 2.1 AA 준수 (shadcn/ui 기본값)
- ✅ Semantic HTML (`<h1>`, `<table>`, `<button>`)
- ✅ ARIA labels (form inputs, icons)
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus visible (outline)
- ✅ Color contrast ratio 4.5:1
- ✅ Alternative text (images)

---

## 10. Implementation Details

### 10.1 API Route Implementation

```typescript
// app/api/quotes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getQuoteFromNotion } from '@/lib/notion-client';
import { validateNotionPageId } from '@/lib/validators';

export const revalidate = 1800; // 30분 캐싱

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1. 파라미터 검증
    if (!validateNotionPageId(id)) {
      return NextResponse.json(
        {
          error: 'Invalid page ID format',
          code: 'INVALID_PAGE_ID',
          message: '유효하지 않은 견적서 ID입니다.',
        },
        { status: 400 }
      );
    }

    // 2. Notion에서 데이터 조회
    const quote = await getQuoteFromNotion(id);

    // 3. 성공 응답
    return NextResponse.json({ data: quote }, { status: 200 });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        {
          error: 'Quote not found',
          code: 'QUOTE_NOT_FOUND',
          message: '해당 견적서를 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.',
      },
      { status: 500 }
    );
  }
}
```

### 10.2 Page Component Implementation

```typescript
// app/quotes/[id]/page.tsx

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getQuoteFromNotion } from '@/lib/notion-client';
import { QuoteViewer } from '@/components/quote/QuoteViewer';
import { LoadingSkeletons } from '@/components/common/LoadingSkeletons';
import { ErrorFallback } from '@/components/common/ErrorFallback';

interface QuotePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: QuotePageProps) {
  try {
    const quote = await getQuoteFromNotion(params.id);
    return {
      title: `견적서 ${quote.number} | 견적서 뷰어`,
      description: `${quote.clientName} 클라이언트 견적서`,
      robots: 'noindex, nofollow', // 공개 링크이므로 검색 엔진 제외
    };
  } catch {
    return {
      title: '견적서 | 견적서 뷰어',
    };
  }
}

export default async function QuotePage({ params }: QuotePageProps) {
  try {
    const quote = await getQuoteFromNotion(params.id);

    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<LoadingSkeletons />}>
          <QuoteViewer quote={quote} />
        </Suspense>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
```

### 10.3 PDF Download Hook

```typescript
// hooks/usePDF.ts

'use client';

import { useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export function usePDF() {
  const [isLoading, setIsLoading] = useState(false);

  const downloadPDF = useCallback(async (elementId: string, filename: string) => {
    setIsLoading(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Target element not found');
      }

      // HTML을 Canvas로 변환
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Canvas를 PDF로 변환
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // 다운로드
      pdf.save(filename);

      toast.success('PDF가 저장되었습니다.');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('PDF 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { downloadPDF, isLoading };
}
```

---

## 11. Error Handling & Edge Cases

### 11.1 Error Scenarios

| Scenario | HTTP Code | Response | UX |
|----------|-----------|----------|-----|
| 잘못된 Page ID | 400 | Invalid format error | 에러 메시지 표시 |
| 존재하지 않는 견적서 | 404 | Not found error | 404 페이지 |
| Notion API 오류 | 503 | Service unavailable | 재시도 버튼 |
| 네트워크 오류 | - | Connection error | 오프라인 메시지 |
| PDF 생성 실패 | - | Client-side error | 토스트 알림 |

### 11.2 Edge Cases

1. **빈 항목 목록**: 항목이 없어도 견적서 표시 가능
2. **특수 문자**: Notion 리치 텍스트의 포맷팅 유지
3. **큰 PDF**: A4 페이지 자동 분할 (jsPDF)
4. **느린 네트워크**: 로딩 상태 표시, 타임아웃 처리
5. **동시 다운로드**: 각 사용자 독립적 PDF 생성

---

## 12. Performance Optimization

### 12.1 Performance Targets

| Metric | Target | 측정 방법 |
|--------|--------|---------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Time to Interactive (TTI) | < 3.5s | Lighthouse |

### 12.2 Optimization Strategies

1. **Caching**:
   - Next.js 자동 캐싱: `revalidate = 1800` (30분)
   - API 응답 캐싱 (ISR - Incremental Static Regeneration)

2. **Image Optimization**:
   - Next.js `<Image>` 컴포넌트 사용
   - WebP 포맷 자동 변환
   - Lazy loading

3. **Code Splitting**:
   - Dynamic imports for PDFDownloadButton
   - pdf-lib 번들 최적화

4. **Data Fetching**:
   - API Route에서 Notion 호출 (클라이언트 직접 호출 금지)
   - 필요한 필드만 선택

### 12.3 Monitoring

- Vercel 내장 Analytics
- Core Web Vitals 모니터링
- Error tracking (선택사항: Sentry)

---

## 13. Security Considerations

### 13.1 Security Measures

| 항목 | 조치 | 설명 |
|------|------|------|
| API 토큰 | 환경 변수 | `NOTION_API_KEY` 절대 노출 금지 |
| API Route | 서버 전용 | 클라이언트에서 직접 Notion 호출 금지 |
| Page ID 검증 | Format check | Notion Page ID 형식 검증 |
| Rate Limiting | 계획 중 | Notion API 호출 제한 (Phase 2) |
| CORS | 필요 시 | API Route에서 관리 |
| CSP | 설정 | Content Security Policy 헤더 |

### 13.2 Data Protection

- ✅ HTTPS 전송 (Vercel 자동)
- ✅ Notion API v2 최신 버전 사용
- ✅ 사용자 데이터 로깅 최소화
- ✅ 공개 링크이므로 인증 필요 없음 (by design)

---

## 14. Testing Strategy

### 14.1 Test Plan (MVP)

| Type | Scope | Tools |
|------|-------|-------|
| **Unit Tests** | API 함수, 데이터 변환 | Jest, @testing-library/react |
| **Integration Tests** | API Route ↔ Notion | Jest, MSW (Mock Service Worker) |
| **Component Tests** | React 컴포넌트 렌더링 | @testing-library/react |
| **E2E Tests** | 사용자 플로우 | ❌ MVP 제외 (Phase 2) |
| **Performance Tests** | Lighthouse, Core Web Vitals | ❌ MVP 제외 (자동 모니터링) |

### 14.2 Test Cases (예시)

```typescript
// __tests__/api/quotes.test.ts
describe('GET /api/quotes/[id]', () => {
  it('should return quote data for valid ID', async () => {
    // Mock Notion API
    // Call /api/quotes/abc123
    // Expect 200 with data
  });

  it('should return 404 for non-existent quote', async () => {
    // Call /api/quotes/invalid-id
    // Expect 404
  });

  it('should handle Notion API errors gracefully', async () => {
    // Mock Notion API to throw error
    // Expect 500 error response
  });
});

// __tests__/components/QuoteViewer.test.tsx
describe('<QuoteViewer />', () => {
  it('should render quote data correctly', () => {
    // Render with mock quote
    // Verify all fields displayed
  });

  it('should trigger PDF download on button click', async () => {
    // Render component
    // Click PDF button
    // Verify download initiated
  });
});
```

---

## 15. Deployment & Operations

### 15.1 Deployment Pipeline

```
1. 개발 (Local)
   └─→ npm run dev

2. 스테이징 (Optional)
   └─→ Preview deployment (Vercel)

3. 프로덕션
   └─→ Main branch push
   └─→ Vercel auto-deploy
   └─→ 배포 완료
```

### 15.2 Environment Setup

**.env.local (개발 환경)**:
```env
NOTION_API_KEY=secret_xxxxx
NOTION_DATABASE_ID=xxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

**Vercel Secrets (프로덕션)**:
```
NOTION_API_KEY = secret_xxxxx
NOTION_DATABASE_ID = xxxxx
NEXT_PUBLIC_BASE_URL = https://example.com
```

### 15.3 Monitoring & Maintenance

- **Vercel Analytics**: 자동 기본 모니터링
- **Error Tracking**: 필요시 Sentry 추가
- **Uptime Monitoring**: Vercel 헬스체크
- **Log Aggregation**: Vercel 로그 (선택사항)

---

## 16. Success Metrics & KPIs

### 16.1 Primary Metrics

| 메트릭 | Target | 측정 방법 |
|--------|--------|---------|
| **Quote View Success Rate** | > 99% | 정상 로드 / 전체 요청 |
| **PDF Download Success** | > 95% | 다운로드 성공 / 클릭 |
| **Page Load Time** | < 2초 | Lighthouse, Vercel Analytics |
| **Error Rate** | < 1% | 에러 응답 / 전체 요청 |

### 16.2 Secondary Metrics

| 메트릭 | 설명 |
|--------|------|
| **User Engagement** | 평균 페이지 체류 시간 |
| **Mobile Conversion** | 모바일에서 PDF 다운로드 완료율 |
| **API Response Time** | Notion API 호출 시간 |

### 16.3 Success Criteria (Go-Live)

✅ 공개 링크를 통한 견적서 조회 가능  
✅ PDF 다운로드 성공률 > 95%  
✅ 모든 디바이스에서 정상 렌더링  
✅ 초기 로드 < 2초  
✅ 에러 응답 처리 완료  

---

## 17. Timeline & Roadmap

### 17.1 Phase 1: MVP (1-2주)

| 주차 | 작업 | 완료 기준 |
|------|------|---------|
| **Week 1** | Notion API 통합, 데이터 파싱, API Route 구현 | 테스트 통과 |
| **Week 1-2** | React 컴포넌트 개발, 스타일링, 반응형 대응 | 개발 완료 |
| **Week 2** | PDF 다운로드 기능, 에러 처리, QA 테스트 | 프로덕션 배포 준비 |

### 17.2 Phase 2: Expansion (향후)

- 🔐 사용자 인증 & 권한 관리
- ✏️ 견적서 생성/수정 (Notion 대신 웹)
- 📊 분석 대시보드 (조회 통계)
- 📧 이메일 추적 (오픈율)
- ✍️ 디지털 서명
- 🌍 다국어 지원

### 17.3 Phase 3: Advanced (장기)

- 💳 결제 통합 (Stripe)
- 🎨 템플릿 관리
- 📱 모바일 앱
- 🔌 Zapier/Make 자동화

---

## 18. Dependencies & Risk Management

### 18.1 External Dependencies

| 의존성 | 버전 | 위험도 | 대응 |
|--------|------|--------|------|
| Notion API | v2 | 낮음 | 공식 문서 준수, SDK 최신 버전 |
| html2canvas | latest | 중간 | 팀 라이선스 확인, 대체 라이브러리 준비 (jsPDF) |
| jsPDF | latest | 낮음 | 오픈소스, 커뮤니티 지원 |
| Next.js 16 | 16.3.2 | 낮음 | 공식 지원, 보안 패치 추적 |

### 18.2 Risk Assessment

| 위험 | 확률 | 영향 | 대응 |
|------|------|------|------|
| Notion API 다운타임 | 낮음 | 높음 | 재시도 로직, 에러 페이지 |
| PDF 렌더링 오류 | 중간 | 중간 | 폴백 (인쇄 버튼), 사용자 지원 |
| 성능 저하 | 중간 | 중간 | 캐싱, 최적화, 모니터링 |
| 보안 취약점 | 낮음 | 높음 | 정기 의존성 업데이트, 보안 감시 |

### 18.3 Mitigation Strategies

1. **Notion API Downtime**:
   - 재시도 로직 구현
   - 사용자 친화적 에러 메시지
   - 상태 페이지 모니터링

2. **PDF Issues**:
   - 다양한 브라우저 테스트
   - 폴백: 인쇄 기능
   - 사용자 피드백 수집

3. **Performance**:
   - 정기적인 Lighthouse 테스트
   - CDN 최적화 (Vercel 자동)
   - 데이터베이스 쿼리 최적화

---

## 19. Resources & Support

### 19.1 Team Requirements

| 역할 | 명수 | 책임 |
|------|------|------|
| **Full-Stack 개발자** | 1 | API Route, React 컴포넌트, 배포 |
| **QA** | 0.5 | 테스트, 브라우저 호환성 |
| **PM** | 0.5 | 스코프 관리, 이해관계자 소통 |

### 19.2 Documentation

- ✅ 이 PRD 문서
- ✅ API 문서 (Swagger/OpenAPI 선택사항)
- ✅ 컴포넌트 Storybook (선택사항)
- ✅ 배포 가이드 (README)
- ✅ 운영 핸드북 (Phase 2)

### 19.3 Support Channels

- GitHub Issues: 버그 리포트
- Slack: 팀 커뮤니케이션
- Email: 고객 지원

---

## 20. Appendix

### 20.1 Glossary

| 용어 | 정의 |
|------|------|
| **Quote** | 견적서 (클라이언트에게 제시된 가격 제안) |
| **Page ID** | Notion의 고유 식별자 (UUID 형식) |
| **Notion API** | Notion 데이터에 프로그래밍 방식으로 접근하는 API |
| **SSR** | Server-Side Rendering (서버에서 HTML 생성) |
| **ISR** | Incremental Static Regeneration (증분 정적 생성) |
| **WCAG** | Web Content Accessibility Guidelines (웹 접근성 표준) |

### 20.2 References

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Notion API Reference](https://developers.notion.com/reference)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [html2canvas Documentation](https://html2canvas.hertzen.com/)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)

### 20.3 Related Documents

- `docs/PRD_PROMPT.md` — 이 PRD의 메타 프롬프트
- `CLAUDE.md` — 프로젝트 기술 스택 및 규칙
- `README.md` — 프로젝트 설정 및 실행 가이드

---

## Document History

| 버전 | 작성일 | 작성자 | 주요 변경사항 |
|------|--------|--------|-------------|
| 1.0 | 2026-08-29 | Claude Code | 초기 PRD 작성 |

---

**Document Status**: ✅ MVP 정의 완료, 개발 준비 가능

**Next Action**: 개발팀과의 킥오프 미팅 → 개발 시작


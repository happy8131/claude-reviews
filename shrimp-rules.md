# Development Guidelines for AI Agents

**This document is exclusively for AI Agent operational guidance. It defines project-specific rules, constraints, and decision-making standards.**

## Project Overview

**Project**: Notion-based Quote Web Viewer MVP

A Next.js application that enables clients to view quotes submitted by sales representatives through Notion without separate login, and download them as PDF files.

**Core Functionality**:
- F001: Quote retrieval from Notion API
- F002: Quote item rendering
- F003: Summary information display
- F004: PDF download functionality
- F005: Responsive layout (mobile/desktop)
- F006: Error handling (NOT_FOUND, PRIVATE, EXPIRED)

**Technology Stack**:
- Runtime: Node.js 20+ (Next.js 16 requirement)
- Frontend Framework: Next.js 16.3.2 (App Router)
- UI Library: React 19.2.8
- Language: TypeScript 5 (strict mode required)
- Styling: Tailwind CSS 4 + shadcn/ui (Base UI)
- External APIs: @notionhq/client
- PDF Generation: html2canvas + jsPDF
- Testing: Playwright MCP
- Package Manager: npm

## Project Architecture

### Directory Structure
```
project-root/
├── app/                      # App Router application
│   ├── layout.tsx            # Root layout (ThemeProvider, Toaster setup)
│   ├── page.tsx              # Home page
│   ├── quotes/
│   │   └── [id]/
│   │       └── page.tsx      # Quote detail page (dynamic route)
│   └── error/                # Error page (404, 403, 410, etc.)
├── components/
│   ├── ui/                   # shadcn/ui Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── [feature components]  # Business logic components
├── lib/
│   ├── utils.ts              # cn() utility for class merging
│   ├── notion.ts             # Notion API client (Phase 3)
│   └── pdf.ts                # PDF generation utilities (Phase 3)
├── docs/
│   ├── PRD.md                # Product Requirements Document
│   └── ROADMAP.md            # Development roadmap (4 Phase, 11 Task)
├── .env.local                # Environment variables (NOTION_API_KEY)
├── .env.example              # Template for env variables (NO KEYS)
├── tsconfig.json             # TypeScript configuration (strict mode, @/* alias)
├── next.config.ts            # Next.js configuration
├── eslint.config.mjs          # ESLint flat config
├── postcss.config.mjs        # PostCSS + Tailwind
└── components.json           # shadcn configuration (style: "base-nova")
```

## Code Standards

### Indentation & Formatting
- Use **2 spaces** for indentation (not tabs)
- Apply ESLint flat config rules (eslint.config.mjs)
- No prettier config; rely on ESLint rules only

### TypeScript
- **Strict mode required**: `"strict": true` in tsconfig.json
- **No `any` type**: Use specific types or `unknown` + type guards
- **Path alias**: `@/*` maps to project root
- **Imports**: Use absolute imports with `@/` prefix

### React Components
- **Functional components only**: No class components
- **Client directive**: Add `"use client"` at top of file if using hooks
- **Server components default**: All components are server components unless explicitly marked `"use client"`
- **Ref forwarding**: Use `forwardRef()` for UI components that need DOM access

### Styling
- **Tailwind CSS only**: No CSS-in-JS, styled-components, or CSS modules
- **Class merging**: Use `cn()` utility from `@/lib/utils.ts`
- **Dark mode**: Use `dark:` prefix for dark mode styles
- **Responsive**: Use `md:`, `lg:` breakpoints

### File Naming
- Components: **PascalCase** (e.g., `QuoteDetail.tsx`)
- Utilities/libraries: **camelCase** (e.g., `notionClient.ts`)
- Routes: **kebab-case** for dynamic segments (e.g., `app/quotes/[id]/page.tsx`)

## Notion API Integration Standards

### Security & Environment Variables
- **API Key Protection**:
  - Store `NOTION_API_KEY` in `.env.local` ONLY (never committed to git)
  - Create `.env.example` with placeholder values (NO real keys)
  - Verify API key is NOT present in client bundle before deployment
  
- **Required env variables**:
  ```env
  NOTION_API_KEY=your-notion-integration-token
  NOTION_QUOTE_DB_ID=notion-database-id-for-quotes
  NOTION_ITEM_DB_ID=notion-database-id-for-items
  ```

### API Call Location Rules
- **✅ ALLOWED**: Route Handlers, Server Components, API utilities in `lib/`
- **❌ FORBIDDEN**: Client components must never directly call Notion API
- **Pattern**: Client component → fetch() to Route Handler → lib/notion.ts handles Notion API

### Type Safety
- Define union type for quote query results:
  ```typescript
  type QuoteResult = 
    | { success: true; quote: Quote; items: Item[] }
    | { success: false; error: "NOT_FOUND" | "PRIVATE" | "EXPIRED" | "FETCH_FAILED" };
  ```

### Implementation Pattern
```typescript
// ✅ lib/notion.ts (server-only)
export async function fetchQuote(quoteId: string): Promise<QuoteResult> {
  // API call logic
}

// ✅ app/api/quotes/[id]/route.ts (Route Handler)
export async function GET(request: Request) {
  const result = await fetchQuote(params.id);
  return Response.json(result);
}

// ✅ components/QuoteDetail.tsx (Client Component)
"use client";
useEffect(() => {
  fetch(`/api/quotes/${quoteId}`).then(r => r.json());
}, [quoteId]);
```

## PDF Generation Standards

### html2canvas Configuration
- **Dark mode handling**: Use `backgroundColor` option from computed styles
- **Non-printable elements**: Mark with `data-no-print` attribute
- **High DPI**: Set `scale: 2` for better quality

### jsPDF Configuration
- **Multi-page handling**: Implement page splitting for long content
- **Filename**: Use quote ID + date (e.g., `quote-ABC123-20260903.pdf`)
- **Paper size**: A4 (210mm × 297mm)

## UI Component Standards

### shadcn/ui Usage
- **Generation**: Use shadcn CLI to add components
  ```bash
  npx shadcn@latest add button
  npx shadcn@latest add card
  ```
- **Configuration**: Respect `components.json` settings (style: "base-nova")
- **Location**: All generated components go to `components/ui/`
- **Customization**: Modify generated components in-place

### Dark Mode
- Root layout provides `ThemeProvider` from `next-themes`
- Use `dark:` Tailwind prefix for dark mode styles
- Theme class applied to `<html>` element

## Testing Standards

### Playwright MCP Test Scenarios
All Phase 3+ tasks must include Playwright MCP tests with these scenarios:

| Scenario Group | Purpose |
|---|---|
| **Normal Flow** | Verify core functionality works |
| **Query Failures** | Verify error handling |
| **Data Edge Cases** | Verify data edge cases |
| **Responsive Design** | Verify layout adapts to screen sizes |
| **Theme Switching** | Verify light/dark mode consistency |
| **Security** | Verify no security leaks (API key, sensitive data) |
| **Regression** | Prevent regressions |

### Test Checklist Format
Each task file should include:
```markdown
## 테스트 체크리스트

### Playwright MCP E2E 테스트
- [ ] 정상 플로우: 견적서 조회 성공
- [ ] 에러 처리: NOT_FOUND 오류 표시
- [ ] 반응형: 모바일(375px) 레이아웃 확인
- [ ] 보안: API 키가 클라이언트 번들에 포함되지 않음
- [ ] PDF 다운로드: 다크모드에서 배경 처리 확인
```

## Next.js 16 Breaking Changes

### Critical Changes to Verify
- **AGENTS.md file**: Check `node_modules/next/dist/docs/` for API changes
- **Request object changes**: Next.js 16 may have different Request/Response APIs
- **Build-time vs runtime**: Notion API calls must be runtime (not build-time)
- **Serialization**: Client components must receive serializable props

## File Interaction Standards

### ROADMAP.md Coordination
- Each Task in ROADMAP.md has corresponding Task file in `/tasks/` directory
- Task file naming: `XXX-task-name.md` (e.g., `001-project-structure.md`)
- Task status in ROADMAP.md must match actual implementation status
- When modifying Task, update both Task file AND ROADMAP.md

### CLAUDE.md Relationship
- CLAUDE.md = general developer documentation
- shrimp-rules.md = AI agent operational rules
- Do not duplicate CLAUDE.md content

## AI Decision-making Standards

### When Requirements Are Ambiguous
1. **Check ROADMAP.md**: Current phase and task context
2. **Check CLAUDE.md**: Existing project conventions
3. **Check PRD.md**: Original business requirements
4. **Default to conservative**: Choose option with fewer side effects

### Component Placement Decision Tree
1. Is it a **UI primitive** (button, card, input)? → `components/ui/`
2. Is it a **feature-specific component**? → `components/`
3. Is it **shared logic**? → `lib/`
4. Is it a **page route**? → `app/[route]/page.tsx`

## Prohibited Actions

### 🚫 Security Violations
- **NEVER** expose `NOTION_API_KEY` in client bundle or console logs
- **NEVER** commit `.env.local` file to git
- **NEVER** call Notion API directly from client component
- **NEVER** store sensitive data in localStorage without encryption

### 🚫 Code Quality Violations
- **NEVER** use TypeScript `any` type
- **NEVER** use CSS-in-JS libraries (styled-components, Emotion)
- **NEVER** commit generated files (`.next`, `node_modules`, `.env.local`)
- **NEVER** import `app/` routes in components

### 🚫 Architecture Violations
- **NEVER** modify `app/layout.tsx` ThemeProvider setup without testing
- **NEVER** remove files from `components/ui/` generated by shadcn
- **NEVER** create authentication until Phase 3 (out of MVP scope)
- **NEVER** add new dependencies without checking package size

### 🚫 Process Violations
- **NEVER** commit without running `npm run lint`
- **NEVER** skip testing when task includes "## 테스트 체크리스트"
- **NEVER** implement features beyond current ROADMAP phase without approval

---

**Last Updated**: 2026-09-03 | **Version**: 1.0

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern Next.js starter kit built with:
- **Next.js 16.3.2** with App Router
- **React 19.2.8** with new features and optimizations
- **TypeScript 5** with strict mode enabled
- **Tailwind CSS 4** with PostCSS for styling
- **shadcn/ui** component library based on Base UI
- **next-themes** for dark mode support
- **Sonner** for toast notifications
- **Lucide React** for icons

## Common Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Structure

### Root-level configuration files
- `tsconfig.json` — TypeScript configuration with path alias `@/*` pointing to root
- `eslint.config.mjs` — ESLint configuration (flat config format) with Next.js and TypeScript presets
- `next.config.ts` — Next.js configuration (currently minimal)
- `postcss.config.mjs` — PostCSS configuration for Tailwind CSS 4
- `components.json` — shadcn CLI configuration with Base UI preset (style: "base-nova"), neutral color, and path aliases

### Main application
- `app/` — App Router application directory
  - `layout.tsx` — Root layout with theme provider, tooltip provider, and toaster setup
  - `page.tsx` — Home page with component showcase
  - `globals.css` — Global styles using Tailwind CSS directives

### Components
- `components/ui/` — Reusable UI components built on Base UI and styled with Tailwind CSS
  - `button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `textarea.tsx`, `badge.tsx`, `separator.tsx`, `avatar.tsx`, `dropdown-menu.tsx`, `tabs.tsx`, `tooltip.tsx`, `sonner.tsx`

## Architecture & Patterns

### Root Layout & Providers
The root layout (`app/layout.tsx`) configures:
- **Geist fonts** from next/font for typography
- **Locale and metadata** — `lang="ko"`, Korean `metadata.title/description`, `metadataBase` for OG tags
- **ThemeProvider** (next-themes) with system-based theme detection and class attribute strategy
- **TooltipProvider** for accessible tooltips across the app
- **Toaster** from Sonner for notifications
- Suppression of hydration warnings for safe client-side theme initialization

### Styling Approach
- **Tailwind CSS** with responsive utilities (md: breakpoint used frequently)
- **Class merging** with `clsx` and `tailwind-merge` to handle conflicting classes
- **CSS variables** for theme colors (light/dark mode support)
- Dark mode via class strategy applied to `<html>` element

### Component Pattern
- UI components use the shadcn/ui pattern: Base UI primitives + Tailwind styling
- Components accept standard HTML props and forward refs where needed
- Compound components (e.g., Tabs, Avatar) use context and composition
- Variant system uses `class-variance-authority` (installed but not yet in use in examples)

### Client vs Server Components
- Root layout is a Server Component
- `app/page.tsx` is a Server Component (component separation refactor moved client logic to dedicated components)
- **Theme & interactive logic** resides in client components like `components/theme-toggle.tsx` (uses `useTheme`, `useState`, `useEffect` with mounted-guard to avoid hydration mismatches)
- Feature components (`components/profile-card.tsx`, `components/feedback-form.tsx`, `components/toast-demo.tsx`) are client components handling user interactions

### Toast Notifications
- Use `toast` from sonner for user feedback
- Variants: `toast.success()`, `toast.error()`, `toast()` for default
- Toaster auto-renders in root layout
- Example: `components/toast-demo.tsx` demonstrates data-driven variant list pattern (DRY approach for multiple toast examples)

### Dark Mode
- Managed by `next-themes` with system preference detection
- Theme toggle component at `components/theme-toggle.tsx` (client component with mounted-guard)
- CSS classes (light/dark) applied to `<html>` for Tailwind dark: prefix support

### Utility Functions
- **`lib/utils.ts`** exports `cn()` helper for merging Tailwind classes with `clsx` and `tailwind-merge`
- Used implicitly by shadcn components to handle class conflicts
- Import path: `@/lib/utils`

## ESLint Configuration

The project uses ESLint 9 with the flat config format (`eslint.config.mjs`):
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- **Custom rule:** `react-hooks/set-state-in-effect` is disabled (allowing setState in effects if needed)
- Ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

Note: If you modify ESLint rules, they take effect on the next lint run.

## TypeScript Path Alias

The `@/*` alias points to the repository root, enabling imports like:
```tsx
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "next-themes";
```

## Important: Next.js 16 Breaking Changes

This project uses **Next.js 16**, which includes breaking changes from earlier versions. Breaking change guidance is auto-maintained by Next.js via `AGENTS.md` (regenerated by `next dev`, sourced from `node_modules/next/dist/server/lib/generate-agent-files.js`). Always consult that file and `node_modules/next/dist/docs/` before writing code involving route handlers, middleware, App Router features, or image optimization.

## Adding New Components

1. Create component file in `components/ui/` (for UI components) or `components/` (for feature components)
2. Use TypeScript with proper prop typing
3. For UI components: import Base UI primitives, apply Tailwind classes, and export
4. For client-side interactivity: add "use client" directive at the top of the file
5. Export from index files if creating component groups (e.g., Tabs with TabsContent, TabsList, etc.)

**Preferred method:** Use shadcn CLI to generate and scaffold UI components:
```bash
npx shadcn@latest add <component-name>
```

This generates components in `components/ui/` with correct styling and structure. Review the `components.json` configuration (style: "base-nova", baseColor: "neutral", iconLibrary: "lucide") to ensure the generated component matches your project's design system.

## Theme and CSS Variables

Tailwind is configured to use CSS variables for color tokens. The light/dark mode detection works via:
- System preference (`prefers-color-scheme`)
- User selection (stored by next-themes)
- Class applied to `<html>` tag

Text colors use Tailwind classes like `text-foreground` and `text-muted-foreground`, which map to CSS variables defined in `globals.css`.

## Development Workflow

1. Make changes to `.tsx` or `.css` files
2. Hot reload is automatic in dev mode
3. Run `npm run lint` to check code quality before committing

## Core Dependencies

- **@base-ui/react** — Unstyled, accessible component primitives (used with shadcn for styled components)
- **next-themes** — Dark mode implementation with system preference detection
- **sonner** — Toast notification library with variant support
- **lucide-react** — Icon library (configured in `components.json`)
- **shadcn** — CLI tool for scaffolding styled UI components in `components/ui/`
- **clsx / tailwind-merge** — Utilities for robust className merging (used by `cn()` helper in `lib/utils.ts`)


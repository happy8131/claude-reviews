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
- `app/page.tsx` is marked "use client" because it uses theme hooks and useState
- Keep theme-dependent logic in client components; use `mounted` state to avoid hydration mismatches

### Toast Notifications
- Use `toast` from sonner for user feedback
- Variants: `toast.success()`, `toast.error()`, `toast()` for default
- Toaster auto-renders in root layout

### Dark Mode
- Managed by `next-themes` with system preference detection
- Theme toggle available in top-right corner of page
- CSS classes (light/dark) applied to `<html>` for Tailwind dark: prefix support

## ESLint Configuration

The project uses ESLint 9 with the flat config format (`eslint.config.mjs`):
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- **Custom rule:** `react-hooks/set-state-in-effect` is disabled (allowing setState in effects if needed)
- Ignores: `.next`, `out`, `build`, `next-env.d.ts`

Note: If you modify ESLint rules, they take effect on the next lint run.

## TypeScript Path Alias

The `@/*` alias points to the repository root, enabling imports like:
```tsx
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "next-themes";
```

## Important: Next.js 16 Breaking Changes

This project uses **Next.js 16**, which includes breaking changes from earlier versions. Before writing code involving:
- Route handlers or API routes
- Middleware
- App Router features (dynamic routes, layouts, error boundaries)
- Image optimization
- Font loading
- Redirects and rewrites

**Always consult `node_modules/next/dist/docs/`** for the current API. The Next.js documentation in your node_modules reflects your exact version and includes deprecation notices.

Key changes to be aware of:
- App Router conventions differ from Pages Router
- Some middleware APIs have changed
- Image component behavior differs from previous versions

## Adding New Components

1. Create component file in `components/ui/` (for UI components) or `components/` (for feature components)
2. Use TypeScript with proper prop typing
3. For UI components: import Base UI primitives, apply Tailwind classes, and export
4. For client-side interactivity: add "use client" directive at the top of the file
5. Export from index files if creating component groups (e.g., Tabs with TabsContent, TabsList, etc.)

Example new component pattern:
```tsx
// components/ui/my-component.tsx
import * as React from "react"

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline"
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ variant = "default", className, ...props }, ref) => (
    <div ref={ref} className={`some-tailwind-classes`} {...props} />
  )
)
MyComponent.displayName = "MyComponent"

export { MyComponent }
```

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
4. Commit messages and code comments should follow the user's established conventions (check CLAUDE.md at `~/.claude/`)

## Dependencies to Know

- **@base-ui/react** — Unstyled, accessible component primitives
- **clsx / tailwind-merge** — Utility functions for className management
- **next-themes** — Easy dark mode implementation
- **sonner** — Toast notification library
- **lucide-react** — Icon library
- **shadcn** — CLI tool for adding new UI components to the project

To add a new shadcn component, use:
```bash
npx shadcn-ui@latest add <component-name>
```

This will generate the component in `components/ui/` with Tailwind styling.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint
```

## Architecture

Next.js 16 (App Router) time-tracking app built with React 19, TypeScript 5, and Tailwind CSS 4. UI language is Spanish.

### State & Data

- **No database** — all data persists in browser localStorage.
- `hooks/useHubTracker.ts` is the central state hook managing categories, tasks, logs, and timer state. All components receive data via props from this hook.
- `hooks/useAlignedTimer.ts` handles precise timer ticks aligned to wall-clock seconds.
- `hooks/useLocalStorageState.ts` is a generic hook for localStorage-backed state.
- `lib/storageKeys.ts` defines localStorage key constants (`hubCategories`, `hubLogs`, `hubStart`, `hubCurrentCat`, `hubTasksByCategory`, `hubCurrentTask`).

### Authentication

NextAuth.js v4 with Google OAuth and JWT strategy (no DB session store). Configured in `lib/auth.ts`. API route at `app/api/auth/[...nextauth]/route.ts`. `components/SessionProvider.tsx` wraps the app in the root layout.

### Key Types

Defined in `lib/types.ts`. Core type is `Log` (id, category, task, hours, date).

### Component Conventions

- All interactive components use `"use client"` directive.
- Components are stateless and single-responsibility; state lives in `useHubTracker`.
- `app/page.tsx` (HubTracker) is the main page composing all components.

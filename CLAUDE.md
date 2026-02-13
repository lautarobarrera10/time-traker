# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint
npx prisma db push    # Sync schema to database
npx prisma generate   # Regenerate Prisma client after schema changes
npx prisma studio     # Visual DB browser
```

## Architecture

Next.js 16 (App Router) time-tracking app built with React 19, TypeScript 5, and Tailwind CSS 4. UI language is Spanish.

### Database & ORM

- **PostgreSQL** (hosted on Neon) with **Prisma ORM**.
- Schema in `prisma/schema.prisma`. Models: User, Account, Session (NextAuth) + Category, Task, TimeLog (app).
- Prisma client singleton in `lib/prisma.ts`.
- `prisma.config.ts` loads env from `.env.local` via dotenv.

### API Routes

All CRUD operations go through protected API routes (check `getAuthUserId()` from `lib/session.ts`):
- `app/api/categories/route.ts` — GET, POST
- `app/api/categories/[id]/route.ts` — PATCH (rename)
- `app/api/tasks/route.ts` — POST
- `app/api/logs/route.ts` — GET, POST
- `app/api/logs/[id]/route.ts` — DELETE

### State & Data

- `hooks/useHubTracker.ts` is the central state hook. It fetches data from the API on mount and manages all CRUD via fetch calls.
- `hooks/useAlignedTimer.ts` handles precise timer ticks aligned to wall-clock seconds.
- Timer state (startTime, elapsedTime, isTracking) is client-only and ephemeral — not persisted to DB.

### Authentication

NextAuth.js v4 with Google OAuth and **PrismaAdapter** (users stored in DB). Configured in `lib/auth.ts`. The session callback injects `user.id` for API route authorization.

### Key Types

Defined in `lib/types.ts`: `CategoryWithTasks`, `TaskItem`, `TimeLogEntry`.

### Component Conventions

- All interactive components use `"use client"` directive.
- Components are stateless and single-responsibility; state lives in `useHubTracker`.
- `app/page.tsx` (HubTracker) is the main page composing all components.

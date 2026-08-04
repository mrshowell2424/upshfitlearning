# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Notes on Next.js Version

**This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.** Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. Always check Next.js 16.2 docs for current API signatures.

## Development Setup & Commands

### Prerequisites
- **Bun** runtime (used instead of npm/yarn/pnpm)
- **PostgreSQL** database (use Supabase free tier)
- Environment variables in `.env.local` (see `.env.example`)

### Starting Development
```bash
bun run dev
# Starts dev server at http://localhost:3000 with HMR
```

### Common Commands
- `bun run build` — build production bundle
- `bun run start` — run production server
- `bun run lint` — lint with ESLint
- `bun run test` — run unit tests with Vitest
- `bun run test:ui` — Vitest with UI dashboard
- `bun run test:coverage` — coverage report
- `bun run test:e2e` — Playwright end-to-end tests
- `bun run test:e2e:ui` — e2e tests with UI
- `bun run db:push` — sync Drizzle schema with database
- `bun run db:seed` — seed resources from Google Sheets
- `bun run db:seed:standards` — seed standards data

### Dev Server (CLI)
Configured in `.claude/launch.json` with name `"upshift"`. When using the Browser pane, start with:
```
preview_start({name: "upshift"})
```

## Tech Stack

- **Framework**: Next.js 16.2 (App Router) with React 19
- **Language**: TypeScript 5
- **Database**: PostgreSQL via Supabase
- **ORM**: Drizzle ORM with drizzle-kit
- **Auth**: Supabase Auth (OAuth)
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest + Testing Library (unit), Playwright (e2e)
- **AI**: Anthropic Claude API
- **Payments**: Stripe
- **Data Loading**: Google Sheets CSV export + in-memory caching

## Project Architecture

### Directory Structure
```
src/
├── app/                    # Next.js 16 App Router (pages and API routes)
│   ├── api/               # API routes grouped by feature
│   │   ├── auth/          # Authentication endpoints
│   │   ├── resources/     # Resource library endpoints
│   │   ├── stripe/        # Payment webhooks and checkout
│   │   ├── webhooks/      # External service integrations (Substack, etc.)
│   │   ├── costs/         # Cost monitoring and analytics
│   │   ├── admin/         # Admin endpoints
│   │   └── search-standards/ # Standards search
│   ├── (public)/          # Public pages
│   │   ├── page.tsx       # Home
│   │   ├── pricing/       # Pricing page
│   │   ├── resources/     # Resource library
│   │   └── layout.tsx
│   ├── (auth)/            # Authentication pages
│   │   ├── signin/
│   │   ├── signup/
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (app)/             # Authenticated app features
│   │   ├── planner/       # Lesson planner
│   │   ├── match/         # Standard matching tool
│   │   ├── lounge/        # Community features
│   │   ├── admin/         # Admin dashboards
│   │   └── layout.tsx
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Low-level UI components (Button, Card, etc.)
│   ├── shared/           # Shared across features (Header, Footer, etc.)
│   ├── auth/             # Auth-specific components
│   ├── resources/        # Resource-specific components
│   └── admin/            # Admin-specific components
├── features/             # Feature-specific business logic (ready for expansion)
│   ├── auth/
│   ├── resources/
│   ├── lessons/
│   ├── standards/
│   └── payments/
├── lib/                  # Core utilities and business logic
│   ├── auth/            # Supabase auth helpers (index.ts)
│   ├── db/              # Database layer
│   │   ├── index.ts     # Database client
│   │   └── schema.ts    # Drizzle ORM schema
│   ├── utils/           # General utilities
│   │   ├── resources.ts    # Resource loading (Google Sheets → memory)
│   │   ├── analytics-engine.ts # Analytics tracking
│   │   └── cost-monitoring.ts  # API cost monitoring
│   ├── hooks/           # Custom React hooks
│   │   └── useSubscription.ts
│   ├── api/             # API client utilities (reserved for expansion)
│   ├── types/           # Shared TypeScript types (reserved for expansion)
│   └── constants/       # App constants (reserved for expansion)
└── providers/           # React context providers (AuthProvider, etc.)

tests/                      # All test files
├── unit/                # Unit tests
├── integration/         # Integration tests (reserved)
└── e2e/                # End-to-end tests

public/                     # Static assets
├── brand/              # Brand assets
└── [other assets]

scripts/                    # Utility scripts (database seeding, etc.)
docs/                       # Documentation
├── guides/             # How-to guides and references
└── [phase summaries]
_archive/                   # Archived reference materials
```

### Key Pages & Routes

| Path | Purpose | Auth |
|------|---------|------|
| `/` | Home page | Public |
| `/resources` | Resource library with filters | Public |
| `/resources/[id]` | Resource detail | Public |
| `/auth/signin` | Sign in page | Public |
| `/auth/signup` | Sign up page | Public |
| `/auth/callback` | OAuth callback | Public |
| `/planner` | Lesson planner | Premium only |
| `/match/[code]` | Standard matching tool | Premium |
| `/lounge` | Community features | Authenticated |
| `/admin/dashboards` | Analytics dashboards | Admin |
| `/api/resources` | Resource list endpoint | Public |

## Data Model

### Core Tables (Drizzle ORM)

**resources** — Teacher resources (videos, lesson plans, guides, etc.)
- `id` (uuid, pk)
- `title`, `purpose`, `summary` — metadata
- `format` — "Video", "Lesson Plan", "Anchor Chart", etc.
- `grade_band` — "K-2", "3-5", "6-8", etc.
- `skill` — learning target
- `youtube_id` — for embedded videos
- `is_free` — access tier
- `published_at`, `created_at`

**standards** — Educational learning standards (K.CC.A, RF.2.3, etc.)
- `code` (varchar, unique)
- `name`, `plain_reading`, `learning_target`
- `skills`, `science_tags`, `match_keys` — jsonb arrays
- `created_at`

**standard_unpacks** — Detailed breakdowns of standards
- Contains `verbs`, `concepts`, `vocabulary`, `prior_skills`
- `ladder` — progression descriptors
- `mastery_statement` — unpacked learning target

**lesson_blueprints** — Pre-built lesson structures tied to standards
- `steps` — lesson sequence with timing and descriptions
- `success_criteria`, `assessment`, `why_it_works` — instruction details
- `tech`, `ai_prompts` — resource recommendations

**courses** — Bundled learning paths
- `track`, `lesson_count`, `duration`
- `is_free` — access tier

### View Models in Code
Types are defined in `lib/resources.ts` and component interfaces. Resource interface:
```typescript
interface Resource {
  id: string
  title: string
  purpose: string
  format: string
  grade_band: string
  skill: string
  is_free: boolean
  published_at: string | Date
  thumbnail_url?: string
}
```

## Authentication & Authorization

Supabase Auth with OAuth (Magic Link, Google, etc.):
- Client: `src/lib/auth/index.ts` exports `supabase` instance and helpers
- `getCurrentUser()` — fetch logged-in user
- `getSubscription(userId)` — fetch user's tier + status
- Tier system: `"free"` | `"pro"` | `"school"`
- Feature gates via `isPremium()`, `canGenerateLessons()`, `canAccessPlanner()`
- Context provider: `src/providers/AuthProvider.tsx` — wraps app with session context

Subscriptions table in Supabase (RLS-protected):
- `user_id`, `tier`, `status`, `created_at`, `renews_at`

## Database & ORM

**Drizzle ORM** with PostgreSQL:
- Schema in `src/lib/db/schema.ts` — all table definitions
- Database client in `src/lib/db/index.ts`
- Migrations stored in `drizzle/` (auto-generated by drizzle-kit)
- Config: `drizzle.config.ts`

**Managing Schema Changes**
1. Edit table definitions in `src/lib/db/schema.ts`
2. Generate migration: `bun run db:push`
3. Drizzle prompts for migration name and applies it
4. Changes sync across all environments

**Data Loading Pattern**
- Resources load from Google Sheets CSV export (cached in memory)
- `src/lib/utils/resources.ts:fetchGoogleSheetResources()` — fetch and parse CSV
- API endpoint `src/app/api/resources/route.ts` — serves paginated/filtered results
- Fallback to sample data if Google Sheets unavailable

## Styling & Design

**Tailwind CSS 4** with custom theme:
- Config in `tailwind.config.ts`
- Fonts: Poppins (from Google Fonts)
- Custom color tokens used: `charcoal`, `coral`, `coral-press`, `text-muted`, `border`, `hairline`
- Utility patterns: `flex`, `grid`, `gap-`, `rounded-`, `px-`, `py-`

**File Patterns**
- All styles inline with Tailwind classes (no separate CSS files except `globals.css`)
- Responsive design via `md:`, `lg:` breakpoints
- Dark mode via `prefers-color-scheme` media queries (if implemented)

## Component Architecture

**Key Shared Components** (in `src/components/shared/`)
- `Header.tsx` — site navigation
- `Footer.tsx` — site footer
- `ResourceCard.tsx` — resource item display

**Component Organization**
- `src/components/ui/` — Reusable low-level UI components
- `src/components/shared/` — Shared across features
- `src/components/auth/` — Auth-specific components
- `src/components/resources/` — Resource-specific components
- `src/components/admin/` — Admin-specific components

**Component Patterns**
- Use `'use client'` at top of interactive components
- Prop types defined inline or in interfaces
- Suspense boundaries for async content (see `src/app/` examples)
- URL search params via `useSearchParams()` hook
- Custom hooks from `src/lib/hooks/`

## API Route Conventions

**Pattern** (`src/app/api/[feature]/[action]/route.ts`)
- Named exports: `GET`, `POST`, `PUT`, `DELETE`
- Accept `NextRequest`, return `NextResponse`
- Handle errors with try/catch, return `{ error: string, status: 5xx }`
- Log errors to console for debugging
- Import utilities from `@/lib/` (using path alias)

**Resource Endpoint** (`src/app/api/resources/route.ts`)
- Query params: `page`, `search`
- Returns: `{ items, total, page, pageSize, totalPages }`
- Supports search across title, purpose, skill
- Uses `@/lib/utils/resources` for data loading

## Testing

**Unit Tests (Vitest)**
- Files: `tests/unit/**/*.test.ts(x)`
- Run: `bun run test` or `bun run test:watch`
- Dashboard: `bun run test:ui` (opens browser)
- Coverage: `bun run test:coverage`
- Fixtures: `tests/unit/fixtures/`

**Integration Tests**
- Files: `tests/integration/**/*.test.ts(x)` (reserved for expansion)
- Run: `bun run test` (same as unit tests)

**End-to-End Tests (Playwright)**
- Files: `tests/e2e/**/*.spec.ts`
- Config: `playwright.config.ts`
- Run: `bun run test:e2e` or `bun run test:e2e:ui`
- Target: http://localhost:3000

## Important Environment Variables

See `.env.example` for template. Required:
- `DATABASE_URL` — PostgreSQL connection string (Supabase)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Auth & data
- `ANTHROPIC_API_KEY` — Claude API access
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` — Payments
- `STRIPE_WEBHOOK_SECRET` — Stripe event validation

Development `.env.local` should never be committed.

## Debugging & Common Issues

**Dev Server Won't Start**
- Ensure Bun is installed: `bun --version`
- Check `.env.local` has all required vars from `.env.example`
- Clear `.next/` and restart: `rm -rf .next && bun run dev`

**Google Sheets Data Not Loading**
- Check the sheet ID in `lib/resources.ts`
- Sheet must be publicly readable (CSV export accessible)
- Look for console warnings like "No resources loaded from Google Sheets"
- Fall back to sample data is logged

**Database Connection Issues**
- Verify `DATABASE_URL` points to live Supabase instance
- Test with: `bun run db:push` (will error clearly if URL wrong)
- Check Supabase dashboard for active connections

**Type Errors with Next.js APIs**
- Always check `node_modules/next/dist/docs/` for current signatures
- Common breaking changes: hook names, config shape, middleware setup
- Read deprecation warnings in build output

## Conventions & Patterns

**Import Aliases**
- `@/app/` — Next.js App Router pages and layouts
- `@/components/` — React components (shared and feature-specific)
- `@/lib/` — Utilities, database, auth, types, constants
- `@/providers/` — Context providers
- `@/features/` — Feature-specific business logic
- Example: `import { supabase } from '@/lib/auth'`

**Naming**
- Components: PascalCase (`ResourceCard.tsx`)
- Page files: lowercase (`page.tsx`, `layout.tsx`)
- Utilities: camelCase (`fetchResources.ts`, `useSubscription.ts`)
- Types/interfaces: PascalCase (`Resource`, `UserProfile`)
- Constants: UPPER_SNAKE_CASE

**Code Style**
- Always use `@/` path alias for imports (configured in `tsconfig.json`)
- Prefer const, destructure where clear
- TypeScript with `@ts-nocheck` only when absolutely necessary (document why)
- No async function names that imply they're callable immediately (`fetchX` is fine)

**Client vs Server**
- Default to Server Components (no directive needed)
- Add `'use client'` only for interactivity (state, hooks, event listeners)
- API calls from pages typically fetch client-side (in useEffect)
- Use `@/lib/auth` for authenticated requests

**Filtering & Search**
- URL-driven state: filters go in searchParams (e.g., `?page=2&filter=free&purpose=X`)
- Page components read params with `useSearchParams()` hook
- Filtering happens in-memory after fetch (for now)

**Feature-Specific Code**
- Place domain-specific business logic in `src/features/[feature]/`
- Keep components in `src/components/` organized by feature when they're used across features
- Use barrel exports (`index.ts`) for cleaner imports from feature folders

## Deployment

- **Production Build**: `bun run build && bun run start`
- **Vercel**: Auto-deploys from git (most common for Next.js)
- **Environment**: Production `.env` must have real API keys, Supabase credentials
- See `DEPLOYMENT_GUIDE.md` and `DEPLOYMENT_PLAYBOOK.md` for full runbooks

## Quick File Location Reference

| Task | Location |
|------|----------|
| Add a new page | `src/app/(public)/[feature]/page.tsx` |
| Add an API endpoint | `src/app/api/[feature]/[action]/route.ts` |
| Create a component | `src/components/[category]/[name].tsx` |
| Add a hook | `src/lib/hooks/use[Name].ts` |
| Add auth logic | `src/lib/auth/index.ts` |
| Database queries | `src/app/api/` (fetch in API route or server action) |
| Add a constant | `src/lib/constants/[name].ts` |
| Add a type | `src/lib/types/[name].ts` |
| Write tests | `tests/unit/[feature].test.ts` or `tests/e2e/[feature].spec.ts` |

## Documentation

All documentation organized in `docs/`:
- `docs/guides/` — How-to guides and references (DEPLOYMENT_GUIDE, TESTING, etc.)
- `docs/` — Phase summaries and project history
- Original code at `docs/AGENTS.md` for Next.js version warnings

Archive of reference materials in `_archive/`:
- Design handoff files
- Substack images
- Prototypes
- Original zip backup

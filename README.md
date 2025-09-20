# QuickGig Frontend

QuickGig.ph is a Next.js 14 App Router project with Tailwind, shadcn/ui, and Supabase-backed data helpers. It ships with demo seed data so the primary job and employer flows are always available in CI.

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm db:seed # optional; seeds Supabase when env vars are configured
pnpm dev
```

Visit <http://localhost:3000> – the home route redirects straight to `/browse-jobs` where the seeded gigs appear.

### Required environment variables

| variable | purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (omit to run in demo in-memory mode) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key for client helpers |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) |
| `NEXT_PUBLIC_APP_ORIGIN` | Base URL used in redirects and generated sitemap |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional analytics hook |

## Available scripts

| command | description |
| --- | --- |
| `pnpm dev` | Start the Next.js dev server |
| `pnpm build` | Build production assets |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Strict TypeScript checks |
| `pnpm db:seed` | Seed Supabase with demo gigs |
| `pnpm test:smoke` | Playwright smoke journey (mobile + desktop) |
| `pnpm test:e2e` | Run the full Playwright suite |

## Smoke workflow

1. `/` redirects to `/browse-jobs`; the list is pre-seeded so CI is never empty.
2. Job detail pages show the canonical `apply-button` and unauthenticated submits redirect to `/login?next=…`.
3. `/applications` and `/gigs/create` both redirect to login when the `qg_auth` cookie is absent.
4. Employers sign in through `/api/auth/demo?role=employer`, post a gig, and see it at the top of `/browse-jobs` with a success banner.

## Demo auth helpers

The repository includes `/api/auth/demo`, `/api/auth/logout`, and `mock-login`/`mock/logout` aliases that mint or clear the `qg_auth` cookie. These endpoints power the smoke specs and make local manual testing straightforward.

## Sitemap & robots

`next-sitemap` generates `sitemap.xml` and `robots.txt` during `pnpm build`. Ensure `NEXT_PUBLIC_APP_ORIGIN` reflects your deployed host before generating production bundles.

# QuickGig Product Baseline (living)
> Single source of truth for shipped features, to avoid rework. Update in each feature PR.

## Core Architecture
- Frontend: Next.js App Router (Vercel)
- API: PHP (Hostinger) • Data/Auth/Storage: Supabase
- Domains: landing `quickgig.ph`, app `app.quickgig.ph`, api `api.quickgig.ph`

## Shipped (✅) / Partial (🟡) / Planned (🗂️)
- ✅ RSC guard: prevent hooks in Server Components (ESLint override)
- ✅ Applications page split: server wrapper + client UI
- ✅ CI toggle: Playwright smoke disabled by default (`RUN_SMOKE=false`)
- 🟡 Location dataset (PSGC): static dataset + GeoSelect — **recovered/in-progress**
- 🟡 Tickets/GCash gating: guard post flow, admin review queue (partially wired)
- 🟡 Messaging & notifications: working, harden + tests later
- 🗂️ Route unification: Landing & in-app “Post/Find” share same components
- 🗂️ Full E2E: run after product completion

## Feature IDs (reference these in PRs)
- FEAT-RSC-GUARD
- FEAT-APPL-CLIENT-SPLIT
- FEAT-CI-SMOKE-TOGGLE
- FEAT-PSGC-STATIC
- FEAT-TICKETS-GATE
- FEAT-ROUTE-UNIFY
- FEAT-MSG-NOTIFS

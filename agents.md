# Agents Contract
## Contract version
- **Version**: 2026-10-03
- **Changes**:
  - Home now redirects to `/browse-jobs` and `/post-job` performs a page-level redirect to `/gigs/create`.
  - Shared `SiteHeader` adds a mobile toggle and keeps canonical nav test IDs across breakpoints while respecting auth-aware links.
  - Smoke coverage trimmed to nav, routing, browse jobs mock listing, and Post Job geo fallback (see `tests/smoke/*.spec.ts`).

## Routes & CTAs (source of truth)
- Header CTAs use canonical IDs (`nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-login`).
- Post Job CTAs resolve through `authAware('/gigs/create')` so unauthenticated clicks land on `/login?next=…` on the app host; the `/post-job` route handler performs a host-aware 302 directly to `/gigs/create`.
- Home (`/`) redirects to `/browse-jobs`.
- `data-testid="browse-jobs-from-empty"` → `/browse-jobs`
- Header shows My Applications at all times and swaps `nav-login` ↔ `nav-logout` based on auth cookie presence.
- Header exposes `data-testid="nav-menu-button"` for the mobile toggle and reuses `data-testid="nav-menu"` for both desktop and mobile menus.

## Auth behavior
- If signed out, clicking either CTA MUST redirect to `/login?next=<dest>`.
- Auth-gated routes: `/applications` and `/my-applications`.
- Middleware redirects unauthenticated `/applications` or `/my-applications` requests to `/login?next=…` using a single Edge-safe redirect.
- Middleware matcher covers `/applications/:path*` and `/my-applications/:path*` so nested routes stay gated.
- `/api/auth/demo?next=/…` mints the shared auth cookie for smoke flows (legacy `/api/mock-login` + `/api/mock/login` remain available). `/api/auth/logout?next=/…` and `/api/mock/logout?next=/…` clear it.

## Legacy redirects (middleware)
- `/find` → `/browse-jobs`
- `/post`, `/posts`, and `/gigs/new` → `/post-job` (route issues a 302 to `/gigs/create`; header/nav remain auth-aware)

- Stable header test IDs: `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-login`.
- Browse list IDs: `jobs-list`, `job-card`; empty state `jobs-empty`.
- Job detail ID: `apply-button`.
- Applications IDs: `applications-list`, `application-row`, `applications-empty`.
- Header smokes query `:visible` to ignore hidden duplicates; CTA href checks accept relative or absolute app URLs.
- Tickets top-up smoke is disabled in PR runs and exercised only in full E2E.
- Applications smoke spec accepts `/login` redirect when unauthenticated.
- Smoke specs cover:
  - `tests/smoke/nav.spec.ts` for desktop links and mobile toggle visibility.
  - `tests/smoke/routing.spec.ts` for home redirect and `/applications` auth gating.
  - `tests/smoke/post_job_geo.spec.ts` for Post Job skeleton visibility and GeoSelect fallback (expects "Quezon City").
  - `tests/smoke/browse_jobs.spec.ts` for mock job card visibility when `MOCK_MODE=1`.
- Job detail smoke skips apply assertion when no job cards are seeded.
- The landing page must not render duplicate CTAs with identical accessible names.
- Smoke helper `expectAuthAwareRedirect(page, dest, timeout)` waits for the PKCE start request and tolerates `chrome-error://` fallbacks.
- `expectLoginOrPkce(page, timeout)` matches either `/login` or `/api/auth/pkce/start` for unauthenticated flows.
- `openMobileMenu(page)` ensures mobile nav is open before interacting.
- `expectListOrEmpty(page, listTestId, emptyMarker)` passes when either list or empty state is visible.
  - Helpers exported from `tests/smoke/_helpers.ts`; reuse in audit/e2e tests instead of reimplementing.
- `clickIfSameOriginOrAssertHref(page, cta, path)` clicks CTAs only when on the same origin, otherwise asserts their href path.
- Smoke tests avoid cross-origin navigation in CI; external links are validated by path only.
- `visByTestId(page, id)` selects the first visible element for a test ID to avoid duplicate ID conflicts.
- `visByTestId(page, id)` falls back to the first match when the CTA is hidden on the current route.
- `expectAuthAwareRedirect(page, okDest)` matches absolute or relative URLs and tolerates `/login` or `/browse-jobs` fallback for unauthenticated redirects.
- `gotoHome(page)` accepts the `/` → `/browse-jobs` redirect as success when the landing page is absent.

## CI guardrails
- `scripts/no-legacy.sh` forbids raw legacy paths (e.g., `/find`).
- `scripts/audit-links.mjs` ensures CTAs point only to canonical routes and accepts auth redirects.
- Middleware (`src/middleware.ts`) handles auth gating for `/applications` and `/my-applications` and short-circuits `/api/auth/pkce/*` in CI.
- Whenever `app/**/routes.ts`, `middleware/**`, or `tests/smoke/**` change, update this document and bump the **Version** date above.

<!-- AGENT CONTRACT v2026-10-03 -->

---

# QuickGig Agent Playbook (READ ME FIRST)

## DO FIRST (hard rules)
- Treat auth-gated flows as **auth-aware**: redirects to `/login?next=` are a *success* condition in PR smoke.
- Prefer stable selectors: `data-testid` over headings/text.
- Do not introduce or resurrect legacy paths in UI (e.g., `/find`) except where explicitly redirected by middleware.
- If you modify routes, middleware, or smoke tests, update **this file** and `BACKFILL.md` with rationale.

## Repository invariants
- **Redirects:** legacy paths normalize in `middleware.ts` and `next.config` `redirects()`.
- **Auth-aware smoke:** specs accept `/login` for gated flows; otherwise assert the form (or skeleton) renders.
- **Error handling:** global `app/error.tsx` + page-level boundaries (e.g., Post Job) prevent white screens.

## When you change these, you must also update this file
- `app/lib/routes.ts`, `middleware/**`, `next.config.*`
- `tests/smoke/**`
- Components that alter Post Job skeleton or header CTAs (ensure test IDs stay stable)
- Any docs that alter smoke expectations

## PR acceptance (agent checklist)
- [ ] No legacy anchors in the UI (run `bash scripts/no-legacy.sh`).
- [ ] Smoke passes locally: `npx playwright test -c playwright.smoke.config.ts`.
- [ ] If unauthenticated flows were touched, smoke specs are **auth-aware** (accept `/login?next=`).
- [ ] `BACKFILL.md` updated with changes + rationale.
- [ ] This file’s header **Version** bumped when contracts change.

See [docs/smoke.md](docs/smoke.md) for smoke test instructions.

```ts
// Unauth flows in smoke:
// Treat /login?next=… as success; do not assert privileged content.
```

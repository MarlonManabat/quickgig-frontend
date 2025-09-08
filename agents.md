# Agents Contract
**Version:** 2025-12-20

## Routes & CTAs (source of truth)
- Use `ROUTES` constants for all navigational links (no raw string paths).
- All CTAs must include `data-cta` matching their test ID.
- Header CTAs:
  - `data-testid="nav-browse-jobs"` → `/browse-jobs`
  - `data-testid="nav-post-job"` → `/post-job`
  - `data-testid="nav-my-applications"` → `/applications`
  - `data-testid="nav-tickets"` → `/tickets`
  - `data-testid="nav-login"` → `/login`
  - `data-testid="nav-logout"` → `/logout`
- Hero CTAs:
  - `data-testid="hero-start"` → `/browse-jobs`
  - `data-testid="hero-post"` → `/post-job`
  - `data-testid="hero-signup"` → `/signup`
- Admin link `/admin/tickets` visible only to allowlisted emails (`ADMIN_EMAILS`).
- `data-testid="browse-jobs-from-empty"` → `/browse-jobs`

## Auth behavior
- If signed out, clicking either CTA MUST 302 to `/login?next=<dest>`.
- Auth-gated routes: `/applications`, `/post-job`.
- In `MOCK_MODE` (CI or missing env), middleware serves stub content instead of redirecting.
- PKCE start API falls back to `/login?next=` in CI/preview and when misconfigured.

## Legacy redirects (middleware)
- `/`      → `/browse-jobs`
- `/find`      → `/browse-jobs`
- `/gigs/create`  → `/post-job` (CI mock bypasses auth)
- Unauthenticated users MAY be redirected to `/login?next=/post-job`.

## Test hooks (smoke/e2e)
- Stable header test IDs: `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-tickets`, `nav-login`.
- Mobile menu button: `nav-menu-button`; container: `nav-menu`.
- Mobile menu IDs: `navm-browse-jobs`, `navm-post-job`, `navm-my-applications`, `navm-tickets`, `navm-login`.
- Landing hero IDs: `hero-start`, `hero-post`, `hero-signup`.
- Post Job skeleton test id: `post-job-skeleton`.
  - Browse list IDs: `jobs-list`, `job-card`.
- Job detail ID: `apply-button`.
- Applications IDs: `applications-list`, `application-row`, `applications-empty`.
- Applications smoke spec accepts `/login` redirect when unauthenticated.
- Added core flows smoke `tests/smoke/core-flows.spec.ts` covering Browse, Applications, Job detail, and Post Job renderings.
- Job detail smoke skips apply assertion when no job cards are seeded.
- The landing page must not render duplicate CTAs with identical accessible names.
- Smoke helper `expectAuthAwareRedirect(page, dest, timeout)` accepts a RegExp destination and succeeds on `/api/auth/pkce/start`, `/login` (with optional query), or the destination.
- `expectLoginOrPkce(page, timeout)` matches either `/login` or `/api/auth/pkce/start` for unauthenticated flows.
  - Helpers exported from `tests/smoke/_helpers.ts`; reuse in audit/e2e tests instead of reimplementing.

## CI guardrails
- `scripts/no-legacy.sh` forbids raw legacy paths (e.g., `/find`, `/post-job`).
- `scripts/audit-links.mjs` ensures CTAs point only to canonical routes and accepts auth redirects.
- Middleware (`src/middleware.ts`) rewrites `/browse-jobs`, `/post-job`, `/applications`, `/tickets` to `_smoke` pages when `MOCK_MODE`, `CI`, or `SMOKE` is active.
- Whenever `app/**/routes.ts`, `middleware/**`, or `tests/smoke/**` change, update this document and bump the **Version** date above.

<!-- AGENT CONTRACT v2025-12-16 -->

---

# QuickGig Agent Playbook (READ ME FIRST)

## DO FIRST (hard rules)
- Use the canonical routes from `app/lib/routes.ts`. **Never** hardcode paths.
- Treat auth-gated flows as **auth-aware**: redirects to `/login?next=` are a *success* condition in PR smoke.
- Prefer stable selectors: `data-testid` over headings/text.
- Do not introduce or resurrect legacy paths in UI (e.g., `/find`, `/browse-jobs`, `/post-job`) except where explicitly redirected by middleware.
- If you modify routes, middleware, or smoke tests, update **this file** and `BACKFILL.md` with rationale.

## Repository invariants
- **Routes:** `app/lib/routes.ts` is the single source of truth. CTAs import from there.
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
- [ ] Smoke passes locally: `npx playwright test -c playwright.smoke.ts`.
- [ ] If unauthenticated flows were touched, smoke specs are **auth-aware** (accept `/login?next=`).
- [ ] `BACKFILL.md` updated with changes + rationale.
- [ ] This file’s header **Version** bumped when contracts change.

See [docs/smoke.md](docs/smoke.md) for smoke test instructions.

```ts
// Unauth flows in smoke:
// Treat /login?next=… as success; do not assert privileged content.
```

# Agents Contract
**Version:** 2025-10-17

## Routes & CTAs (source of truth)
- Use `ROUTES` constants for all navigational links (no raw string paths).
- Header CTAs:
  - `data-testid="nav-browse-jobs"` → `/browse-jobs`
  - `data-testid="nav-post-job"` → `/gigs/create`
  - `data-testid="nav-my-applications"` → `/applications`
  - `data-testid="nav-login"` → `/login`
  - Tickets link → `/tickets`
- Admin link `/admin/tickets` visible only to allowlisted emails (`ADMIN_EMAILS`).

## Auth behavior
- If signed out, clicking either CTA MUST 302 to `/login?next=<dest>`.
- Auth-gated routes: `/applications`, `/gigs/create`.

## Legacy redirects (middleware)
- `/find`      → `/browse-jobs`
- `/post-job`  → `/gigs/create`
- Unauthenticated users MAY be redirected to `/login?next=/gigs/create`.

## Test hooks (smoke/e2e)
- Stable header test IDs: `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-login`.
- Mobile menu button: `nav-menu-button`; container: `nav-menu`.
- Mobile menu IDs: `navm-browse-jobs`, `navm-post-job`, `navm-my-applications`, `navm-login`.
- Landing hero IDs: `hero-browse-jobs`, `hero-post-job`.
- Post Job skeleton test id: `post-job-skeleton`.
- Browse list IDs: `jobs-list`, `job-card`.
- Job detail ID: `apply-button`.
- Applications IDs: `applications-list`, `application-row`, `applications-empty`.
- The landing page must not render duplicate CTAs with identical accessible names.

## CI guardrails
- `scripts/no-legacy.sh` forbids raw legacy paths (e.g., `/find`, `/post-job`).
- `scripts/check-cta-links.mjs` ensures CTAs point only to canonical routes.
- Whenever `app/**/routes.ts`, `middleware/**`, or `tests/smoke/**` change, update this document and bump the **Version** date above.

<!-- AGENT CONTRACT v2025-09-09 -->

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

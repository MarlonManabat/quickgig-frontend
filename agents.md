# Agents Contract
**Version:** 2026-09-17

## Routes & CTAs (source of truth)
- Header CTAs use canonical IDs (`nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-login`).
- Hero CTAs:
  - `data-testid="hero-start"` → `/browse-jobs`
- `data-testid="browse-jobs-from-empty"` → `/browse-jobs`

## Auth behavior
- If signed out, clicking either CTA MUST redirect to `/login?next=<dest>`.
- Auth-gated routes: `/applications`.
- Middleware redirects unauthenticated `/applications` requests to `/login?next=…` using a single Edge-safe redirect.


## Legacy redirects (middleware)
- `/find` → `/browse-jobs`

- Stable header test IDs: `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-login`.
- Mobile navigation toggles via `nav-mobile-toggle`/`nav-menu` but uses the same IDs as desktop links.
- Landing hero IDs: `hero-start`.
  - Browse list IDs: `jobs-list`, `job-card`.
- Job detail ID: `apply-button`.
- Applications IDs: `applications-list`, `application-row`, `applications-empty`.
- Header smokes query `:visible` to ignore hidden duplicates; CTA href checks accept relative or absolute app URLs.
- Tickets top-up smoke is disabled in PR runs and exercised only in full E2E.
- Applications smoke spec accepts `/login` redirect when unauthenticated.
- Added core flows smoke `tests/smoke/core.spec.ts` covering Browse Jobs, Apply redirects, Applications gate, Post Job skeleton, header nav, and landing CTAs.
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
- `gotoHome(page)` accepts automatic home→/browse-jobs redirects when landing is absent; current landing returns 200 with a `hero-start` CTA.

## CI guardrails
- `scripts/no-legacy.sh` forbids raw legacy paths (e.g., `/find`).
- `scripts/audit-links.mjs` ensures CTAs point only to canonical routes and accepts auth redirects.
- Middleware (`src/middleware.ts`) handles auth gating for `/applications` and short-circuits `/api/auth/pkce/*` in CI.
- Whenever `app/**/routes.ts`, `middleware/**`, or `tests/smoke/**` change, update this document and bump the **Version** date above.

<!-- AGENT CONTRACT v2025-12-16 -->

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
- [ ] Smoke passes locally: `npx playwright test -c playwright.smoke.ts`.
- [ ] If unauthenticated flows were touched, smoke specs are **auth-aware** (accept `/login?next=`).
- [ ] `BACKFILL.md` updated with changes + rationale.
- [ ] This file’s header **Version** bumped when contracts change.

See [docs/smoke.md](docs/smoke.md) for smoke test instructions.

```ts
// Unauth flows in smoke:
// Treat /login?next=… as success; do not assert privileged content.
```

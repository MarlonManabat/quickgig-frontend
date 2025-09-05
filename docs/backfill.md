# Backfill / Change Log (Landing → App routing)

## 2025-09-03
- Added `NEXT_PUBLIC_APP_ORIGIN` and `src/lib/urls.ts` utility to centralize the app host.
- Converted all landing CTAs (hero, nav, footer, and cards) to absolute links to the app:
  - `/browse-jobs`, `/gigs/create`, `/applications`, `/login`.
- Introduced landing `middleware.ts` that **keeps** marketing homepage on `/`
  but **redirects** the app paths above to the canonical app host with HTTP **308**.
- Added Playwright smoke test `tests/smoke/landing-to-app.spec.ts` to ensure links open on `app.quickgig.ph`.
- Product-first guardrails:
  - Do **not** change or remove app routes/middleware in this repo.
  - Keep landing homepage content and SEO intact.
  - Any future landing CTA that targets an app feature **must** use `toAppPath('/path')`.

## 2025-09-04 — Lock landing CTAs to app host; product-first guardrails

- All landing CTAs (desktop + mobile) now link to the canonical app host using `NEXT_PUBLIC_APP_ORIGIN` (defaults to `https://app.quickgig.ph`):  
  - Browse jobs → `/browse-jobs`  
  - Post a job → `/gigs/create`  
  - My Applications → `/applications`  
  - Sign in → `/login`
- Rationale: ensure marketing → app flows never regress, in PR previews and production.
- Guardrails we keep checking:
  1. App root `/` must resolve to the product (redirect to `/browse-jobs`) — no 404s.
  2. App routes stay stable (`/browse-jobs`, `/gigs/create`, `/applications`, `/login`).
  3. Middleware host checks remain unchanged.
  4. E2E/smoke must pass without test edits for this flow.

## 2025-09-04 – Landing → App navigation & host policy

- Decision: Landing CTAs must open the App domain in **production** (`https://app.quickgig.ph`), but remain **relative** in preview/dev so local CI can run.
- Implementation: `getAppOrigin()` + `toAppPath()` centralize link construction. In prod, they prefix `https://app.quickgig.ph`; otherwise they return relative paths.
- Tests: `landing-to-app.spec.ts` accepts both absolute app host and localhost/relative during CI to avoid flakes while still catching wrong paths in production.
- Guardrails:
  1) Do NOT introduce new marketing pages that deep-link into legacy paths. Always use `toAppPath()`.
  2) Do NOT tighten middleware to block preview hosts or “/” root; it must never 404 in preview.
  3) Any change that modifies routes/nav must update smoke tests in the same PR.
- Ops note: Ensure `NEXT_PUBLIC_APP_ORIGIN=https://app.quickgig.ph` is set for the production project in Vercel. Leave it unset for preview.

## 2025-09-04 — E2E policy & nav fix

- Fixed app header “My Applications” href → `/applications` via ROUTES.
- E2E: Skips @auth suites when `BASE_URL` targets production (`app.quickgig.ph`) since `/api/test/login-as` is disabled in prod.
- E2E: “My Applications (signed-out)” now accepts `/login` or `/applications/login`.
- Outcome: PR/preview runs full suite; prod E2E runs only safe, signed-out flows.

### 2025-09-04 — Stabilize CTAs, auth-aware smoke, and guard legacy paths

**Summary**
- Centralized navigation to `ROUTES` constants; removed raw hrefs for header CTAs.
- Standardized header CTAs:
  - `data-testid="nav-post-job"` → `/gigs/create`
  - `data-testid="nav-my-applications"` → `/applications`
- Hardened unauth flows: smoke/e2e treat redirects to `/login?next=<dest>` as **success**.
- Normalized legacy paths in middleware:
  - `/find` → `/browse-jobs`
  - `/post-job` → `/gigs/create`
- Added Post Job error boundary + skeleton test id `post-job-skeleton` to prevent white screens.
- Introduced CI guardrails:
  - `scripts/no-legacy.sh` and `scripts/check-cta-links.mjs`
  - `agents-contract / verify` requires `agents.md` to reflect contract & bumped version on relevant changes.

**Rationale**
- Repeated regressions came from mixed sources of truth (raw hrefs, ad-hoc redirects) and brittle tests.
- This makes CTA behavior explicit, testable, and enforced in CI.

**Impact / Migrations**
- Components must import paths from `app/lib/routes.ts`.
- Tests should prefer `data-testid` selectors over headings/text.
- Landing MUST NOT render duplicate CTAs with identical accessible names.

**How to verify**
- Manual: landing shows one “Post a job” and one “My Applications”; signed-out clicks 302 to `/login?next=…`; `/gigs/create` shows form/skeleton with no white screen.
- Scripts: `bash scripts/no-legacy.sh`; `node scripts/check-cta-links.mjs`.
- Smoke: `npx playwright test -c playwright.smoke.ts`.

**Rollback**
- Revert the PR(s) that introduced the contract & guardrails if a critical issue appears; routes fall back to previous behavior.

## 2025-09-04 — Canonical routes & responsive header

**Summary**
- Root `/` and legacy paths normalize to `/browse-jobs`.
- `LinkApp` + `toAppPath` ensure CTAs hit the app host in prod.
- Single source header drives desktop and mobile menus with stable IDs:
  - `nav-browse-jobs`, `nav-post-job`, `nav-my-applications`, `nav-login`
  - `navm-browse-jobs`, `navm-post-job`, `navm-my-applications`, `navm-login`

**Rationale**
- Prevent link drift and keep auth-aware flows consistent across devices.

**Impact / Migrations**
- Use `LinkApp` with `ROUTES` constants for new CTAs.
- Tests must treat `/login?next=<dest>` redirects as success for gated links.

**How to verify**
- `npm run no-legacy`
- `node scripts/check-cta-links.mjs`
- `npx playwright test -c playwright.smoke.ts`

**Rollback**
- Revert the PR if navigation or auth flows break.

## 2025-09-05 — Auth-gated redirects & responsive header

**Summary**
- Middleware now redirects unsigned users from `/applications` and `/gigs/create` to `/login?next=<dest>` and preserves any query string.
- Header derives desktop and mobile menus from a single `NAV_ITEMS` source with unique test IDs and no duplicate login link.
 - Menu panel mounts only when open so `navm-menu` is visible for smoke tests.
- `scripts/check-cta-links.mjs` validates header and hero CTAs against `ROUTES`.

**Rationale**
- Preserve destination after sign-in and keep nav CTAs deterministic for smoke tests.

**Impact / Migrations**
- Use `NAV_ITEMS` + `LinkApp` for header links.
- Tests rely on stable CTA IDs and treat `/login?next=<dest>` as success for gated links.

**How to verify**
- Visit `/applications` or `/gigs/create` while signed out → `/login?next=<dest>`.
- `npm run no-legacy`
- `node scripts/check-cta-links.mjs`
- `npx playwright test -c playwright.smoke.ts`

**Rollback**
- Revert this commit to restore previous middleware and header behavior.

## 2025-09-06 — Apply skeleton & seeded browse

**Summary**
- Seeded jobs list ensures `/browse-jobs` is non-empty in dev/CI.
- Added job detail page with auth-aware Apply CTA.
- Stubbed `/applications` page with empty state and stable test IDs.
- Introduced smoke tests for browse list, apply flow, and applications empty state.

**Rationale**
- Provide deterministic flows for applying to jobs and viewing applications while backend is WIP.

**Impact / Migrations**
- Use `jobs-list`, `job-card`, `apply-button`, `applications-list`, `application-row`, `applications-empty` test IDs in tests.

**How to verify**
- `npm run no-legacy`
- `node scripts/check-cta-links.mjs`
- `npx playwright test -c playwright.smoke.ts`

**Rollback**
- Revert this commit to remove apply skeleton and seeded browse list.

## 2025-09-07 — Routing helpers & smoke workflow
- Centralized `ROUTES` + `toAppPath` in `src/lib/routes.ts` and updated LinkApp & pages.
- Added GitHub `Smoke (main)` workflow and Playwright browser caching for PRs.
- `scripts/check-cta-links.mjs` now guards against duplicate CTA test IDs.

## 2025-09-07 — Auth-aware helper & mobile menu IDs
- Hardened `expectAuthAwareRedirect` helper for smoke/e2e tests (accepts `string | RegExp`).
- Mobile menu button/panel now `navm-menu-button`/`navm-menu`; smoke tests open the menu deterministically.

## 2025-09-08 — URL-based auth redirects & menu test IDs
- Rewrote e2e helpers to parse URLs instead of building regexes, fixing `Invalid regular expression flag` errors.
- Canonicalized mobile menu button/container to `nav-menu-button`/`nav-menu` (tests fall back to legacy `navm-*`).
- Updated nav and hero smokes to share the new helpers and stabilize menu opening.

## 2025-09-09 — Consolidated smoke workflow & regex-safe auth helper
- Replaced separate PR and main smoke workflows with a unified `smoke.yml` that installs Playwright browsers via `npx playwright install --with-deps`.
- Simplified auth-aware redirect helper to build regexes safely and dropped legacy `navm-*` menu fallbacks.
- Mobile nav smokes now open `nav-menu` explicitly and rely on unique `navm-*` link IDs.


## 2025-09-05 — CI cleanup: dedupe workflows & finalize required checks
- Removed duplicate/obsolete workflow files and bootstrap jobs.
- Canonicalized PR checks to match ruleset:
  - Lint / eslint (pull_request)
  - Type Check / tsc (pull_request)
  - Smoke (PR) / Run smoke (pull_request)
- Renamed push variants to include “(push)” to avoid sidebar duplication.
- Added concurrency to prevent overlapping runs on the same ref.
- Outcome: Actions list is clean; branch protection gates align with actual PR jobs.

### [CI] Lock Guard + Deduped workflows (2025-09-05)
- Auto-repair npm lockfile on PRs when `npm ci` fails; commit `package-lock.json` back to the PR branch.
- Deduplicated Lint/Type Check/Smoke workflows; stabilized check names to match ruleset.
- Added concurrency to avoid duplicate runs.
- Pinned Node 20 / npm 10; quiet installs.
**Acceptance:** All three required checks pass on the PR after lock repair; deploy preview succeeds.

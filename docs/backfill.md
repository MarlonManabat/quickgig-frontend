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

### 2025-09-04 — Mobile app header fix
- Collapsed app header CTAs into a responsive menu on small screens; prevents duplicate CTAs and cramped layout.
- All header links now use `LinkApp` + `ROUTES`; no raw paths.
- Added smoke `tests/smoke/app-header-mobile.spec.ts` to assert menu behavior and routing on mobile.

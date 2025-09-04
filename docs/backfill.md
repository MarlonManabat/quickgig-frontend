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

## 2025-09-04 — Navigation/Auth Stabilization

### Contracts
- CTAs come from a single source of truth: `app/lib/routes.ts`.
- Auth-gated flows (e.g., Post a Job, My Applications) may redirect to `/login?next=…` when unauthenticated. Tests treat this as success.
- Error boundaries (global + page) prevent white-screen failures and show a friendly message.

### Legacy compatibility
- Normalized redirects at:
  1) `middleware.ts` (case-insensitive; trims trailing slash)
  2) `next.config` `redirects()` (build-time/CDN safety)
  3) Route fallback for any legacy `app/**/find/page.tsx`
- Map:
  `/find`, `/gigs`, `/browsejobs`, `/post-job`, `/my-apps` → modern equivalents.

### CI guardrails
- **Smoke (auth-aware)**: accepts `/login` for gated flows; otherwise checks heading or skeleton.
- **Health checks**: HEAD/GET `/login`, `/browse-jobs`, `/gigs/create`, `/applications` must be 200/30x.
- **No-legacy gate**: CI fails if any anchor uses banned legacy paths.
- **Prod E2E policy**: suites that require `/api/test/login-as` are skipped on `BASE_URL=app.quickgig.ph`.

### Regression checklist
- [ ] Smoke green (preview + PR).
- [ ] Legacy paths redirect correctly (manual spot-check OK).
- [ ] Health workflow green.
- [ ] No legacy anchors (`scripts/no-legacy.sh`).
- [ ] Error boundaries render (no white blank screens) on forced errors.

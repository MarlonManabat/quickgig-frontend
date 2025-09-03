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
  - Any future landing CTA that targets an app feature **must** use `appUrl('/path')`.

## 2025-09-04 – Lock landing CTAs to app host

- Added `src/lib/urls.ts` and `NEXT_PUBLIC_APP_ORIGIN` (default `https://app.quickgig.ph`).
- Updated landing CTAs/nav to link cross-origin to the app (Browse jobs, Post a job, My Applications, Sign in).
- Purpose: product-first guardrail so marketing buttons always drive into the app; matches smoke.
- Related: restored MVP baseline earlier this week; kept root redirect and middleware safety intact.

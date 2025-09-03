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

## 2025-09-03 — Mobile polish
- Added sticky responsive navbar with mobile menu (no route/text changes).
- Standardized narrow container & safe-area padding.
- Increased touch targets: inputs ≥16px text, buttons ≥44px height.
- Prevented iOS zoom on inputs; ensured forms and lists are full-width on small screens.
- Added lightweight mobile smoke test (390×844) clicking the Browse jobs link via the mobile menu.
- No changes to business logic, routes, or API.

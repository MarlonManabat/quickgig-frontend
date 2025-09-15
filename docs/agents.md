<!-- AGENT CONTRACT v2025-12-16 -->

## 2026-09-20
- Header reads `qg_auth` cookie client-side and swaps `nav-login` for `nav-my-applications` when authenticated.
- Landing hero uses `hero-start` with `cta-browse-jobs` CTA.
- Middleware continues to gate `/applications`.

## 2026-09-19
- Header renders canonical `nav-*` test IDs across breakpoints.
- Landing hero uses `hero-start` container with `hero-browse-cta`.
- `/applications` remains auth-gated via middleware.

## 2026-09-18
- Simplified header with always-visible nav links and new landing CTAs `cta-browse-jobs`, `cta-post-job`, `cta-my-applications`.
- Auth gate for `/applications` retained in middleware.

## 2025-12-14
- Added signup/logout routes, hero-start CTA, and per-route error/loading.

## 2025-12-15
- Documented CTA contract and logout endpoint.

## 2025-09-07
- Header CTAs canonicalized; friendly auth errors; non-blank 404/500; link-audit script.

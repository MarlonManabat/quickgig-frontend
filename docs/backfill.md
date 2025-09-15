# Backfill / Change Log (Landing → App routing)

## 2026-09-24 — Edge-gate my-applications
- Middleware now gates `/my-applications` alongside `/applications` and preserves the full destination in `next` query param.
- `/browse-jobs` soft-fails when API base is missing and exposes `jobs-empty-state` when no jobs are available.

## 2026-09-23 — Hero landing and auth-aware applications
- Home now renders a hero with `hero-start` linking to `/browse-jobs`.
- Added `/my-applications` page that redirects unauthenticated users to `/login?next=/my-applications`.
- Inlined header with canonical `nav-*` IDs and set `metadataBase`.
- Browse Jobs list always renders `jobs-list` container even when empty.

## 2026-09-22 — Browse jobs API integration
- `/browse-jobs` now fetches real jobs with pagination and empty-state fallback.
- Added `/browse-jobs/[id]` detail page with auth-aware Apply CTA.

## 2026-09-21 — Redirect home and static header
- Home now redirects to `/browse-jobs` which hosts the `hero-start` CTA.
- Header always shows `nav-*` links (Login and My Applications present simultaneously).
- Removed `(app)` duplicates for Applications and Browse Jobs to resolve Next.js build error.
- Middleware continues to gate `/applications` for unauthenticated users.

## 2026-09-20 — Auth-aware header & simple placeholders
- Header reads `qg_auth` cookie to toggle `nav-login` vs `nav-my-applications` and links Post a job to `/gigs/create`.
- Landing hero keeps `hero-start` with `cta-browse-jobs`.
- Browse Jobs, Post Job, Login, and Applications pages are minimal placeholders.
- Middleware gates `/applications` for unauthenticated users.

## 2026-09-19 — Test-friendly header and hero landing
- Replaced header with `AppHeader` exposing stable `nav-*` IDs across breakpoints.
- Landing now renders `hero-start` with `hero-browse-cta`; `/` no longer redirects.
- Browse Jobs shows an explicit empty state and Post Job exposes `post-job-skeleton`.
- Middleware keeps `/applications` auth-gated via `qg_auth`.

## 2026-09-18 — Inline header and landing CTAs
- Simplified header into layout; removed mobile nav toggle and kept canonical `nav-*` IDs.
- Added minimal landing and placeholder pages; middleware continues gating `/applications`.

## 2026-09-17 — Toggle mobile nav & narrow middleware
- Header extracted to a shared component with `nav-mobile-toggle` / `nav-menu` and canonical `nav-*` IDs.
- Middleware matcher limited to `/applications` so other routes aren't intercepted.

## 2026-09-16 — Simplified header nav IDs
- Header links are always visible and reuse canonical `nav-*` IDs across viewports.
- Removed `-menu` suffixed IDs and related mobile menu expectations.

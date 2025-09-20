# Backfill / Change Log (Landing → App routing)


## 2026-10-06 — CI guardrails + smoke alignment
- Replaced the root agents contract with the Good Product checklist and canonical selector list.
- Added agreements/ docs plus ops/status.json to satisfy repository guardrails and unblock audits.
- Updated tooling (lint/typecheck scripts, env typings) and refreshed smoke tests to assert auth-aware redirects documented in README.

## 2026-10-05 — Next.js 14 rebuild + Good Product baseline
- Replaced the legacy `/src` app with a clean App Router build that keeps canonical `nav-*` selectors and hero CTAs.
- Added in-memory data store with Supabase fallbacks plus `/api/auth/demo` + `/api/auth/logout` helpers for smoke flows.
- Implemented new Browse Jobs filters, job detail apply tracking, Post Job form with `post-job-skeleton`, and auth-gated Applications.
- Regenerated Playwright smoke (`tests/smoke.spec.ts`) covering browse → apply redirect, applications gate, and employer posting.

## 2026-10-02 — Demo auth routes and login wiring
- Added `/api/auth/demo` GET helper that issues the shared auth cookie then redirects with `next` fallback to `/my-applications`.
- `/api/auth/logout` now mirrors the mock helper cookie clearing (domain-aware) so demo logouts clear subdomain cookies.
- Login page switches to host-aware GET anchors for demo login/logout; header + logout page now hit `/api/auth/logout`.

## 2026-10-01 — /post-job served via route handler
- Removed the conflicting `/post-job/page.tsx` so the route handler owns the 302 redirect to `/gigs/create`.
- Route handler now documents the host-aware redirect behavior.

## 2026-09-30 — Prod-safe jobs fallback & legacy redirect
- Env reader only hard-requires `NEXT_PUBLIC_API_BASE_URL` on Vercel production; previews/CI/dev render fallbacks.
- `/browse-jobs` exposes `jobs-empty` for the empty state and keeps deterministic mock listings when the API is unavailable.
- Added a route handler so `/post-job` issues a 302 to `/gigs/create` while header CTAs remain auth-aware (My Applications uses `authAware` when signed out).

## 2026-09-29 — Auth cookie helpers & apply tracking
- Added `/api/mock/login` and `/api/mock/logout` POST helpers (with shared cookie domains) and wired the login page to submit forms.
- Middleware now inspects the raw cookie header so Edge gating stays in sync with SSR checks.
- Browse job Apply CTA records `/api/track/apply` before navigating, ensuring apply clicks are tracked even when mocks run.

## 2026-09-27 — Mock auth helpers and logout swap
- Added `/api/mock-login` to set the shared auth cookie and `/api/logout` to clear it with safe redirects.
- Header now toggles `nav-login`/`nav-logout` when signed in and links Post Job directly for authed requests.
- Middleware and auth utilities share cookie constants so gate checks stay consistent.

## 2026-09-26 — Auth-aware Post Job publish flow
- `/post-job` now server-redirects to the app host login with `next` preserving `/gigs/create`.
- Header, landing CTAs, and shared nav use the new `authAware('/gigs/create')` helper so app-host deployments stay absolute.
- Legacy `/post*` routes and rewrites funnel into `/post-job` to keep the auth-aware publish flow consistent.

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

# Agents Contract
Version: 2025-09-04

## Canonical Routes
- browseJobs → `/browse-jobs`
- postJob → `/gigs/create`
- applications → `/applications`
- login → `/login`

## Header CTA test IDs
- `nav-browse-jobs`
- `nav-post-job`
- `nav-my-applications`
- `nav-login`

## Hero CTA test IDs
- `hero-browse-jobs`
- `hero-post-job`

## Auth-aware success
- For auth-gated routes, landing on the destination **or** `/login?next=<dest>` counts as success.

## PR acceptance checklist
- [ ] `bash scripts/no-legacy.sh`
- [ ] `node scripts/check-cta-links.mjs`
- [ ] `npx playwright test -c playwright.smoke.ts`
- [ ] `docs/backfill.md` updated with rationale.

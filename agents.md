## Repo + Stack
- App: quickgig-frontend (Next.js Pages Router, TypeScript). Deploy: Vercel.
- Backend: Supabase (RLS). No secrets in code. Stripe is **stub only** (don’t add live Stripe deps).

## Product Invariants (must stay true)
- PH locations: canonical cascades (regions → provinces → cities), **NCR special** = Metro Manila with **17 LGUs incl. Pateros**.
- Onboarding credits: **employer.post_credits = 3**, **worker.apply_credits = 3** on sign-up. After 0, posting/applying is gated by **manual GCash** (order → upload proof → admin approve).
- Core flows: auth (magic link), gigs CRUD, applications with messages/offers/hire, notifications.

## Operating Rules
- Small, sequential PRs. Each PR description must include: **Summary, Changes, Testing, Acceptance, Notes**.
- No secrets in code. Write non-code steps to `/docs/*.md`. Put SQL/RLS into `/supabase/migrations/*` (idempotent).
- Keep visuals/theme consistent with landing unless explicitly asked to change.
- Never limit dropdown contents to “what’s in the DB”; always show canonical lists with JSON fallback.

## File/Dir Conventions
- Canonical data: `public/data/ph/{regions,provinces,cities}.json`.
- Shared selector: `components/location/LocationSelect.tsx` (SSR disabled; JSON fallback + DB merge).
- Credits API: `pages/api/credits/(can-post|consume-post|can-apply|consume-apply).ts`.

## CI Contracts (names must match)
- PR smoke: **Release Check (PR smoke)** → build + Playwright smoke + clickmap.
- Full QA (manual/nightly): **Final QA (full)**.
- Artifacts saved under `artifacts/**`.

## Self-Heal Allowlist (what Codex may auto-fix)
- **Module not found / `fs` in client** → move data to `public/`, use `fetch`, enable `resolveJsonModule`.
- **Auth loop** → honor `redirectTo` on magic-link callback.
- **RLS “not authorized”** → add owner read/update policy for the referenced table.
- **NCR shows only “Manila”** → replace legacy selects with `LocationSelect`; assert **17** LGUs in tests.
- **404 to known routes** → add minimal non-destructive stubs.
> Self-heal must NOT change payment logic or destructive actions.

## Click Audit Scope (non-destructive)
Pages: `/`, `/post`, `/search`, `/inbox`, `/admin`, `/login`, `/dashboard`.  
Exclude: buttons with text `Delete|Remove|Archive|Approve|Reject` or `[data-test=destructive]`.

## PR Template
- **Summary:** …
- **Changes:** …
- **Testing Steps:** …
- **Acceptance:** …
- **CI:** PR smoke + clickmap green; full QA unaffected.
- **Rollback:** revert PR; no data migration required.

## Do-Not-Touch
- Stripe live integrations (stub only).
- Demo seed users and credits defaults.
- Production secrets/env vars.

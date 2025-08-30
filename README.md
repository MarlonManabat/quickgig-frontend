# QuickGig Frontend

Minimal Next.js app using Supabase for authentication, profiles and gig postings.

## Environment

Define in Vercel (and `.env.local` for local dev):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm start` - run production build

## CI

All automated checks run through a single GitHub Actions workflow, [Release Check](.github/workflows/release-check.yml).
It provisions a Vercel preview, seeds deterministic test data, then executes a multi-role Playwright suite.
Each role (public, worker, employer, admin) audits visible buttons and performs basic happy path navigation.
Artifacts from the run, including button audit JSON and Playwright reports, are always uploaded.
If lint-based fixes are available an `autofix.patch` artifact is generated which can be applied locally:

```
git apply autofix.patch
```

### Build/CI quirks

- We intentionally pin **globby@14.x**.
- **v14** API: `import { globby } from 'globby'` (named export)
- Action: We'll revisit upgrading to v14 when registry/yank issues stop causing noise.

### Health endpoint for CI
CI and E2E use the App Router health check at `/api/health` (file: `app/api/health/route.ts`).
Avoid duplicating the same route under `pages/api/*` to prevent Next.js build conflicts.

## Testing

```bash
# Optional: provide demo emails for smoke specs
export DEMO_USER_EMAIL="qa-user@example.com"
export DEMO_ADMIN_EMAIL="qa-admin@example.com"
```

## Smoke tests

```
curl -X POST https://app.quickgig.ph/api/orders
curl -X POST -H "Content-Type: application/json" -d '{"proof_url":"https://.../receipt.jpg"}' https://app.quickgig.ph/api/orders/<id>/submit
curl -X POST -H "Content-Type: application/json" -d '{"decision":"paid"}' https://app.quickgig.ph/api/orders/<id>/decide
curl https://app.quickgig.ph/api/users/me/eligibility
```

## Deployment notes

* After deploy, run **/api/admin/seed** once to promote `SEED_ADMIN_EMAIL` to admin.
* Apply the migration via Supabase Studio → SQL or `supabase db push`.

### APP origin for landing → app links
Set `NEXT_PUBLIC_APP_ORIGIN` (preferred) or `APP_ORIGIN` to the app host, e.g. `https://app.quickgig.ph`.
All landing CTAs resolve via `withAppOrigin()`.

- Landing CTAs use plain `<a>` elements (not Next.js `Link`) with `withAppOrigin()` for absolute links.
- `getAppOrigin()` resolves from `NEXT_PUBLIC_APP_ORIGIN`, `APP_ORIGIN`, or defaults to `https://app.quickgig.ph`.
- `/create` is a real page guarded by `PostGuardInline` which shows “please log in” when unauthenticated.
- Landing and other public pages must not import Supabase helpers.

### Landing → App CTAs and E2E
- Landing uses plain `<a>` + `withAppOrigin()` for absolute links (no `next/link`).
- `withAppOrigin()` resolves from `NEXT_PUBLIC_APP_ORIGIN | APP_ORIGIN | https://app.quickgig.ph`.
- `/create` is a real page rendering an inline guard (`"please log in"`) when logged out; no redirects and no RPC.
- Full E2E runs on every push to `main` and via manual dispatch. Playwright report is uploaded as an artifact.

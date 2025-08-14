# QuickGig Frontend

A Next.js application for QuickGig.ph configured for deployment on Vercel.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and adjust as needed. The app
 defaults to the public API if the variable is missing:
  ```env
  NEXT_PUBLIC_API_URL=https://api.quickgig.ph
  ```

To verify the live API locally, run:

```bash
BASE=https://api.quickgig.ph node tools/check_live_api.mjs
```

## Authentication

The app communicates with an external API using the `/src/lib/api.ts` helper. When `auth` is set on a request, a JWT token stored in `localStorage` is sent in the `Authorization` header. If the backend issues HttpOnly cookies, they are included automatically.

Tokens are managed through `/src/lib/auth.ts`, and basic route protection is available via `/src/lib/withAuth.tsx`.

## Development

Run the development server and visit the branded home page at
[http://localhost:3000/](http://localhost:3000/) or the health page at
[http://localhost:3000/health-check](http://localhost:3000/health-check):

```bash
npm run dev
```

## Deployment

Deployment is handled via the Vercel GitHub integration. Ensure the
`NEXT_PUBLIC_API_URL` environment variable is set in your Vercel project
settings.

Login, signup, and other protected pages call the external API at
`https://api.quickgig.ph`; this Next.js app does not provide any API routes.

### Option A behavior

* The main site `/` redirects to `/app`, which proxies `https://app.quickgig.ph`.
* `/health-check` remains available for diagnostics.
* If login via `/app` has cookie issues, set API/app cookies with:
  `Domain=.quickgig.ph; Path=/; Secure; HttpOnly; SameSite=None`.
* Direct usage of [https://app.quickgig.ph](https://app.quickgig.ph) still works.

### Smoke checks

The app defaults to the public API if `NEXT_PUBLIC_API_URL` is unset:

```env
NEXT_PUBLIC_API_URL=https://api.quickgig.ph
```

Verify the production app and API:

```bash
npm run check:app
BASE=https://api.quickgig.ph npm run check:api
```

## Production routing
- quickgig.ph/ redirects to /app
- /app/* proxies https://app.quickgig.ph/*

# QuickGig Frontend – Production Runbook

This repo hosts the Next.js frontend for QuickGig.

## Domains
- **Root (Vercel):** `https://quickgig.ph`
- **Product path:** `https://quickgig.ph/app` *(proxied from `https://app.quickgig.ph` via Next.js rewrites)*
- **Legacy app (preserved):** `https://app.quickgig.ph`
- **API (PHP on Hostinger):** `https://api.quickgig.ph`

## Routing
- `/` **redirects** to `/app` (permanent).
- `/app/*` is **proxied** to `https://app.quickgig.ph/*` by `next.config.js` rewrites.
- Deep links and nav CTAs must point to `/app` (same-origin). CI has a scan that fails if `https://app.quickgig.ph` is hardcoded in UI.

## Environment
- `NEXT_PUBLIC_API_URL=https://api.quickgig.ph`

## Cookies & Auth
The API sets a session cookie (e.g., `qg_session`) with:
- `Domain=.quickgig.ph`
- `Path=/`
- `Secure; HttpOnly; SameSite=None`
- Expiry: ~30 days

Frontend requests must include credentials:
```ts
fetch(apiUrl, { credentials: 'include' })
```

## CORS (API)

Allowlist:

* `https://quickgig.ph` *(and `https://app.quickgig.ph` while legacy host is preserved)*

Headers:

```
Access-Control-Allow-Origin: <request origin if allowlisted>
Vary: Origin
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

Preflight (`OPTIONS`) should return `200`.

## Health & CI

* **API health:** `https://api.quickgig.ph/health.php` → JSON `{ ok: true, ts: <unix> }`
* **Smoke workflow** (`.github/workflows/smoke.yml`):

  * On `main`: checks API health and that `/` redirects and `/app` loads (2xx/3xx) using `BASE=https://quickgig.ph`.
  * On PRs: app check may skip unless `BASE` is provided.

### Local/Preview Notes

* Local dev: the `/app` rewrite attempts to reach `https://app.quickgig.ph`; if blocked, local `/app` may 500—this is expected and not a blocker. Validate on Vercel preview or production.

## Manual Triage

* Frontend: visit `https://quickgig.ph/` (should redirect to `/app`) and navigate through the product.
* API: `https://api.quickgig.ph/health.php` in a browser.
* DevTools → Application → Cookies: confirm `.quickgig.ph` cookie, `Secure`, `HttpOnly`, `SameSite=None`.

## Screenshots / Evidence (attach in PR description)

* `quickgig.ph` redirecting to `/app`
* `/app` rendering under the **quickgig.ph** origin
* `api.quickgig.ph/health.php` JSON
* Latest successful **Smoke** run on `main`


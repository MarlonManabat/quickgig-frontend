# QuickGig Frontend

A Next.js application for QuickGig.ph configured for deployment on Vercel.

## Routing (production)

- `quickgig.ph` and `www.quickgig.ph` are served by Vercel and issue a 308 to `https://app.quickgig.ph/:path*`
- `app.quickgig.ph` is hosted on Hostinger and serves the live product.
- No Vercel domain is attached to `app.quickgig.ph`. This avoids DNS conflicts and preserves the working app.
- Rollback: revert this PR to restore any previous behavior.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and adjust as needed. Sensible
   defaults are included for local development:
   ```env
NEXT_PUBLIC_API_URL=http://localhost:3001
API_URL=http://localhost:3001
JWT_COOKIE_NAME=auth_token
NEXT_PUBLIC_ENABLE_APPLY=false
NEXT_PUBLIC_ENV=local
```

To verify the live API locally, run:

```bash
BASE=https://api.quickgig.ph node tools/check_live_api.mjs
```

## Authentication

Session routes in `src/app/api/session` proxy to the backend and set an HTTP-only cookie used for auth. `middleware.ts` protects sensitive pages.

## Development

Run the development server and visit the branded home page at
[http://localhost:3000/](http://localhost:3000/) or the health page at
[http://localhost:3000/health-check](http://localhost:3000/health-check):

```bash
npm run dev
```

During development, `/system/env` displays the public environment values
with badges for any missing entries.

## E2E Smoke Tests

To run the Playwright smoke suite locally against the live app:

```bash
npm i
npm run playwright:install
BASE=https://app.quickgig.ph npm run test:e2e:smoke
```

## Deployment

Deployment is handled via the Vercel GitHub integration. Ensure the
  `NEXT_PUBLIC_API_URL` environment variable is set in your Vercel project
settings.

Login, signup, and other protected pages call the external API at
`https://api.quickgig.ph`; this Next.js app does not provide any API routes.

### Behavior

* `https://quickgig.ph` and `https://www.quickgig.ph` issue a 308 redirect to `https://app.quickgig.ph`.
* `/health-check` remains available for diagnostics.
* If login via `https://app.quickgig.ph` has cookie issues, set API/app cookies with:
  `Domain=.quickgig.ph; Path=/; Secure; HttpOnly; SameSite=None`.
* The `app.quickgig.ph` host serves the live product on Hostinger.

### Smoke checks

  The app defaults to a local API if `NEXT_PUBLIC_API_URL` is unset:

```env
  NEXT_PUBLIC_API_URL=http://localhost:3001
```

Verify the production root and API:

```bash
BASE=https://quickgig.ph node tools/check_root.mjs
BASE=https://api.quickgig.ph npm run check:api
```

## Production routing
- `https://quickgig.ph` → 308 to `https://app.quickgig.ph`
- `https://www.quickgig.ph` → 308 to `https://app.quickgig.ph`
- `https://app.quickgig.ph` serves the live product

# QuickGig Frontend – Production Runbook

This repo hosts the Next.js frontend for QuickGig.

## Domains
- **Primary:** `https://quickgig.ph`
- **Legacy alias:** `https://app.quickgig.ph`
- **API (PHP on Hostinger):** `https://api.quickgig.ph`

## Routing
- `/` serves the app directly. Legacy `/app` paths redirect to `/`.

## Environment
Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local && npm run dev
```

Set these in Vercel → Project → Settings → Environment Variables:

- `NEXT_PUBLIC_API_URL` – backend API base URL exposed to the client
- `API_URL` – server-side base URL for the backend
- `JWT_COOKIE_NAME` – name of the auth cookie
- `NEXT_PUBLIC_ENABLE_APPLY` – enable Apply buttons for jobs

To enable the Apply flow in production, set `NEXT_PUBLIC_ENABLE_APPLY=true` in your Vercel project settings.

API endpoints live in [`src/config/api.ts`](src/config/api.ts); edit them if your backend paths differ.

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
* Minimal CI: install + build.

### Local/Preview Notes

* Local dev: root redirect may not be representative; validate on Vercel preview or production.

## Manual Triage

* Frontend: `curl -I https://quickgig.ph/` shows `308` with `Location: https://app.quickgig.ph/`.
* API: `https://api.quickgig.ph/health.php` in a browser.
* DevTools → Application → Cookies: confirm `.quickgig.ph` cookie, `Secure`, `HttpOnly`, `SameSite=None`.

## Screenshots / Evidence (attach in PR description)

* `quickgig.ph` rendering correctly
* `api.quickgig.ph/health.php` JSON


## Production Domains (canonical)
- Product: https://app.quickgig.ph  ✅
- Root: https://quickgig.ph  → 308 to https://app.quickgig.ph
- WWW:  https://www.quickgig.ph → 308 to https://app.quickgig.ph
- API:  https://api.quickgig.ph

### Operations
- Verify redirects:
  curl -I https://quickgig.ph
  curl -I https://www.quickgig.ph

- Verify product:
  open https://app.quickgig.ph

- Verify API:
  curl -i https://api.quickgig.ph/health.php

### Cookies & CORS
- Cookies from API: Domain=.quickgig.ph; Path=/; Secure; HttpOnly; SameSite=None
- CORS: allow https://app.quickgig.ph (and quickgig.ph if needed), with credentials.

## Routing restore runbook

- `app.quickgig.ph` serves the product on Hostinger (A=89.116.53.39).
- `quickgig.ph` and `www.quickgig.ph` redirect with 308 to `https://app.quickgig.ph`.
- No proxying of `/app` via Next.js or Vercel.
- Verification commands:
  ```bash
  dig +short app.quickgig.ph; dig +short CNAME app.quickgig.ph
  curl -I https://app.quickgig.ph
  curl -I https://quickgig.ph; curl -I https://www.quickgig.ph
  ```
  Operator tools only; CI does not enforce these checks.

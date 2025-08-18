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

## Flags

- `NEXT_PUBLIC_ENABLE_INTERVIEWS_UI` – enable interview scheduling UI. When enabled, the app uses `/api/interviews` and `/api/interviews/[id]` for creating and updating interviews. Optional helpers:
  - `NEXT_PUBLIC_INTERVIEW_DEFAULT_METHOD` – default method (`video`, `phone`, `in_person`).
  - `NEXT_PUBLIC_INTERVIEW_SLOT_MINUTES` – default duration in minutes.
  - `INTERVIEWS_WEBHOOK_URL` – POST webhook on create/update (best effort).
- `NEXT_PUBLIC_ENABLE_SETTINGS` – enable account settings page under `/settings`. Stores preferences in a signed `settings` cookie mirrored to `localStorage` for instant reloads. In `ENGINE_AUTH_MODE=php`, requests proxy to `${ENGINE_BASE_URL}/api/settings`.
- `NEXT_PUBLIC_DEFAULT_LANGUAGE` – default language (`en` or `tl`) used when no user settings exist.
- `NEXT_PUBLIC_DEFAULT_EMAIL_PREFS` – initial email preference (`none`, `alerts_only`, `all`).
- `NEXT_PUBLIC_DEFAULT_ALERTS_FREQUENCY` – default alerts digest frequency (`off`, `daily`, `weekly`).

### Language smoke test

With settings enabled locally, run:

```bash
node -e "fetch('http://localhost:3000/api/settings',{method:'PUT',headers:{'content-type':'application/json'},body:'{\"language\":\"tl\"}'}).then(()=>console.log('ok'))"
```

Reload the app and the UI should display Taglish strings.

## Jobs search & saved jobs

The `/jobs` page offers search, filters and pagination. Filter values are
reflected in the URL so a pre-filtered view can be shared by copying the link.
Supported query parameters:

```
q, location, category, type, remote=1, minSalary, maxSalary,
sort=recent|salary|relevance, page, limit, saved=1
```

Job cards include a **Save** button. Saved jobs are stored in `localStorage` by
default. If the optional `NEXT_PUBLIC_ENABLE_SAVED_API=true` flag is set and the
backend provides the endpoints, saved jobs are also synced via:

- `GET ${API.savedList}` – hydrate saved IDs
- `POST ${API.savedToggle(id)}` – toggle saved status

Use the “Saved only” filter on the Jobs page to view saved jobs.

## Applicant applications

Turn on `NEXT_PUBLIC_ENABLE_APPLICANT_APPS=true` to expose a `/applications` page for logged-in applicants. The page lists submitted applications and lets you update their status or navigate to related jobs and messages.

## Job Alerts

Turn on with `NEXT_PUBLIC_ENABLE_ALERTS=true` and optionally set
`ALERTS_DIGEST_SECRET` if the backend checks a shared secret. Backend
endpoints expected (see `src/config/api.ts`):

- `GET ${API.alertsList}` – list my alerts
- `POST ${API.alertsCreate}` – create `{ name, filters, frequency, email }`
- `PATCH ${API.alertsUpdate(id)}` – update an alert
- `POST ${API.alertsDelete(id)}` – delete an alert
- `POST ${API.alertsToggle(id)}` – toggle email notifications
- `POST ${API.alertsRunDigest}` – trigger digest (optional)

Vercel Cron setup:

- Path: `/api/cron/job-alerts`
- Method: `POST`
- Schedule: `0 1 * * *` (daily 01:00 UTC) or `0 17 * * *`

Create an alert from the **Create Alert from filters** button on `/jobs` and
manage them in `/settings/alerts`.

## Reports & Admin Moderation

- `NEXT_PUBLIC_ENABLE_REPORTS` — show reporting UI on jobs and profiles.
- `NEXT_PUBLIC_ENABLE_ADMIN` — enable admin links in the UI.
- `ADMIN_EMAILS` — comma-separated allowlist of email addresses treated as admins.

Admin pages live under `/admin` and expect the following backend endpoints
(see `src/config/api.ts`):

- `GET ${API.adminSummary}` – dashboard counts
- `GET ${API.adminJobsPending}` – pending jobs
- `POST ${API.adminJobApprove(id)}` – approve job
- `POST ${API.adminJobReject(id)}` – reject job
- `GET ${API.adminReportsList}` – list reports
- `POST ${API.adminReportResolve(id)}` – resolve report
- `GET ${API.adminUsersList}` – list users
- `POST ${API.adminUserBan(id)}` – ban user
- `POST ${API.adminUserUnban(id)}` – unban user
- `GET ${API.adminAuditList}` – audit log

Logged-in users can report a job or profile via a small **Report** link, which
sends `{ type:'job'|'user', targetId, reason, details? }` to
`${API.reportCreate}`.

## Metrics

- `NEXT_PUBLIC_ENABLE_ANALYTICS` – enable client event tracking
- `METRICS_SECRET` – optional shared secret for backend validation

Tracked events:

- `view_home` – homepage viewed
- `view_jobs` – jobs list viewed
- `view_job` – job detail viewed `{ id }`
- `signup_success` – registration completed
- `login_success` – login completed
- `apply_success` – job application submitted `{ jobId }`
- `message_send` – message sent `{ conversationId }`
- `job_post` – employer created a job
- `job_publish` – employer published a job
- `alert_create` – job alert created

Backend endpoints (see `src/config/api.ts`):

- `POST ${API.metricsTrack}` – proxy from `/api/metrics/track`
- `GET ${API.metricsSummary}` – summary counts
- `GET ${API.metricsTimeseries}` – timeseries data

The frontend never blocks or fails the UI if the metrics backend is absent; `/api/metrics/track` always returns `{ ok: true }`.

## Email notifications

Emails are off by default. To enable sending, set in `.env`:

```env
NEXT_PUBLIC_ENABLE_EMAILS=true
RESEND_API_KEY=your_resend_api_key
```

When disabled or misconfigured, the app skips sends without affecting user flows.

## Authentication

Session routes in `src/app/api/session` proxy to the backend and set an HTTP-only cookie used for auth. `middleware.ts` protects sensitive pages.

## Profiles & Settings

New routes:

- `/settings/profile` – edit applicant profile and manage resume uploads (PDF, 10 MB max)
- `/settings/account` – change password and request a reset link
- `/u/[id]` – public applicant profile
- `/c/[slug]` – public company page

Uploads are proxied via `/api/upload/resume` and `/api/upload/logo`, forwarding multipart bodies to the backend with auth cookies.
Backend endpoints for these features are defined in [`src/config/api.ts`](src/config/api.ts).

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
- `EMPLOYER_EMAILS` – comma-separated list of emails with employer access in dev
- `RESEND_API_KEY` – Resend API key to enable email notifications
- `NOTIFY_FROM` – from address for notifications (e.g., `QuickGig <noreply@quickgig.ph>`)
- `NOTIFY_ADMIN_EMAIL` – fallback email for employer alerts

To enable the Apply flow in production, set `NEXT_PUBLIC_ENABLE_APPLY=true` in your Vercel project settings.

Notifications are optional. Configure `RESEND_API_KEY` and `NOTIFY_FROM` in Vercel to enable email delivery. If these keys are unset, notification requests are skipped and a warning is logged.

API endpoints live in [`src/config/api.ts`](src/config/api.ts); edit them if your backend paths differ.

### Employer API

- `GET /employer/jobs/list.php`
- `POST /employer/jobs/create.php`
- `PATCH /employer/jobs/update.php?id={id}`
- `POST /employer/jobs/toggle.php?id={id}` with `{ published: boolean }`

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

## Production Setup

Set the following in Vercel → Project → Settings → Environment Variables:

- `NEXT_PUBLIC_API_URL`
- `API_URL`
- `JWT_COOKIE_NAME`
- `NEXT_PUBLIC_ENABLE_APPLY`
- `RESEND_API_KEY` *(optional)*
- `NOTIFY_FROM` *(optional)*
- `NOTIFY_ADMIN_EMAIL` *(optional)*

After saving, redeploy via Vercel and verify at [`/system/status`](./src/app/system/status/page.tsx).
To add a payment QR, upload `public/gcash-qr.png` and redeploy.

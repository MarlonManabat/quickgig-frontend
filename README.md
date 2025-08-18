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

### Auth Proxy

Authentication calls now go through same-origin Next.js routes (`/api/session/*`).
These proxy to `${NEXT_PUBLIC_API_URL}` (default `https://quickgig.ph`) and
forward headers, method, body, and cookies, removing the need for CORS workarounds.

### Vercel Preview

Smoke tests are automatically skipped on Vercel builds. To run smoke locally or
in CI, opt in explicitly:

```bash
RUN_SMOKE=1 SMOKE_BASE_URL=http://127.0.0.1:3000 npm run build
```

### Quick Start: Staging

1. Copy `.env.staging.example` to `.env.local`.
2. `ENGINE_MODE=php npm run build` to test against the staging engine.

### Staging Verification

```bash
curl -I https://staging.quickgig.ph/api/health/engine
curl https://staging.quickgig.ph/api/session
curl https://staging.quickgig.ph/api/jobs?limit=1
curl https://staging.quickgig.ph/api/jobs/1
curl https://staging.quickgig.ph/api/profile
curl https://staging.quickgig.ph/api/applications
```

## Staging engine cutover

The app targets a PHP engine in staging but keeps mock flows as a safety net.

1. Enable the engine by setting in `.env.local`:
   ```env
   ENGINE_MODE=php
   ENGINE_BASE_URL=https://api.quickgig.ph
   ALLOW_ENGINE_FALLBACK=true
   ```
2. Deploy and verify with:
   ```bash
   curl https://staging.quickgig.ph/api/engine/health
   ```
3. Roll back by removing or changing `ENGINE_MODE`.

When the engine is unreachable or returns non‑2xx responses, the app
automatically falls back to existing mock or legacy flows.

## Public Launch Prep

The production build enables core launch features by default when `NODE_ENV=production`:

- Emails
- Unified Notifications Center
- Interviews with invites and reminders
- Payments

### Rollout

1. Copy `.env.production.example` to `.env.production` and add secrets.
2. Deploy with `NODE_ENV=production`.
3. Run smoke tests:

   ```bash
   NODE_ENV=production BASE=https://app.quickgig.ph npm run smoke
   ```

### Rollback

1. Set the launch flags above to `false` in `.env.production`.
2. Redeploy.

Security headers and monitoring remain active via `NEXT_PUBLIC_ENABLE_SECURITY_AUDIT` and are covered by the smoke script.

## Flags

### Beta Release Toggle (Flagged)

- `NEXT_PUBLIC_ENABLE_BETA_RELEASE` – turn on core beta flows together in staging. Automatically enables emails, notifications center, interviews, interview invites/reminders, and payments.

Enable locally by setting in `.env.local`:

```
NEXT_PUBLIC_ENABLE_BETA_RELEASE=true
```

Then run:

```
BASE=http://localhost:3000 npm run smoke
```

Rollback: set `NEXT_PUBLIC_ENABLE_BETA_RELEASE=false` and redeploy.

### App Shell V2 (Flagged)

- `NEXT_PUBLIC_ENABLE_APP_SHELL_V2` – opt-in new header/footer and tokens matching app.quickgig.ph. UI only, no route changes.

Enable locally by setting in `.env.local`:

```
NEXT_PUBLIC_ENABLE_APP_SHELL_V2=true
```

Rollback: remove or set `NEXT_PUBLIC_ENABLE_APP_SHELL_V2=false` and redeploy.

### Engine Wiring Status Page (Flagged)

- `NEXT_PUBLIC_ENABLE_STATUS_PAGE` – expose internal `/status` page showing engine and DB health.

Enable locally by setting in `.env.local`:

```
NEXT_PUBLIC_ENABLE_STATUS_PAGE=true
```

Rollback: set `NEXT_PUBLIC_ENABLE_STATUS_PAGE=false` and redeploy.

Notes: internal health check, not for SEO.

### Security + Monitoring (Flagged)

- `NEXT_PUBLIC_ENABLE_SECURITY_AUDIT` – tighter security headers, API rate limiting, and `/status/ping` uptime endpoint.

Enable locally by setting in `.env.local`:

```
NEXT_PUBLIC_ENABLE_SECURITY_AUDIT=true
```

Then run:

```
BASE=http://localhost:3000 npm run smoke
```

Rollback: set `NEXT_PUBLIC_ENABLE_SECURITY_AUDIT=false` and redeploy.

Notes: works in mock and php engine modes; logs request metrics to console.

### Post-Launch Monitoring & Analytics (Flagged)

- `NEXT_PUBLIC_ENABLE_MONITORING` – enable Sentry error tracking, basic performance metrics, and product analytics stubs.

Enable locally by setting in `.env.local`:

```
NEXT_PUBLIC_ENABLE_MONITORING=true
SENTRY_DSN=your-sentry-dsn
MIXPANEL_TOKEN=your-mixpanel-token
```

Then run:

```
BASE=http://localhost:3000 npm run smoke
```

Rollback: set `NEXT_PUBLIC_ENABLE_MONITORING=false` and redeploy.

Notes: skips integrations when env vars are missing; logs to console in mock mode only.

### Localization & Content Polish (Flagged)

- `NEXT_PUBLIC_ENABLE_I18N_POLISH` – refine EN/Taglish strings and marketing copy on landing pages.

Enable locally by setting in `.env.local`:

```
NEXT_PUBLIC_ENABLE_I18N_POLISH=true
```

Then run:

```
BASE=http://localhost:3000 npm run smoke
```

Rollback: set `NEXT_PUBLIC_ENABLE_I18N_POLISH=false` and redeploy.

Notes: polish-only, safe rollback by disabling flag.

### Apply Flow Happy Path Audit (Flagged)

- `NEXT_PUBLIC_ENABLE_APPLY_FLOW_AUDIT` – run snapshot tests for the Apply flow in mock mode. Dev/test only.

Enable locally by setting in `.env.local`:

```
NEXT_PUBLIC_ENABLE_APPLY_FLOW_AUDIT=true
```

Then run:

```
BASE=http://localhost:3000 npm run smoke
```

Rollback: set `NEXT_PUBLIC_ENABLE_APPLY_FLOW_AUDIT=false` and redeploy.

Notes: mock mode only; ensures Apply happy path UI renders.

### Interview Reminders QA Harness (Flagged)

- `NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS_QA` – run a mock invite + reminder flow and expose test markers.

Enable locally by setting in `.env.local`:

```
NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS_QA=true
```

Then run:

```
npx playwright test tests/interviewRemindersQA.spec.ts
```

Rollback: set `NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS_QA=false` and redeploy.

Notes: dev/test only, mock-safe. Page `/qa/interview-reminders` renders `invite-sent` and `reminder-sent` markers.

### Bulk Rejection Email Dry-Run Harness (Flagged)

- `NEXT_PUBLIC_ENABLE_BULK_REJECTION_QA` – generate mock bulk rejection emails and expose test markers.

Enable locally by setting in `.env.local`:

```
NEXT_PUBLIC_ENABLE_BULK_REJECTION_QA=true
```

Then run:

```
npx playwright test tests/bulkRejectionEmailHarness.spec.ts
BASE=http://localhost:3000 node tools/smoke.mjs
```

Rollback: set `NEXT_PUBLIC_ENABLE_BULK_REJECTION_QA=false` and redeploy.

Notes: mock/test only, no live emails sent. Page `/qa/bulk-rejection` renders `bulk-email-preview` markers.

### Notifications Center QA Harness (Flagged)

- `NEXT_PUBLIC_ENABLE_NOTIFY_CENTER_QA` – simulate mock job/employer notifications and expose toast + list markers.

Enable locally by setting in `.env.local`:

```
NEXT_PUBLIC_ENABLE_NOTIFY_CENTER_QA=true
```

Then run:

```
npx playwright test tests/notificationsCenterQA.spec.ts
BASE=http://localhost:3000 node tools/smoke.mjs
```

Rollback: set `NEXT_PUBLIC_ENABLE_NOTIFY_CENTER_QA=false` and redeploy.

Notes: dev/test only, mock-safe. Page `/qa/notifications-center` renders `toast-msg` and `notify-list` markers.

### Hiring Decisions QA Harness (Flagged)

- `NEXT_PUBLIC_ENABLE_HIRING_QA` – simulate hiring decisions and job closeout in mock mode.

Enable locally by setting in `.env.local`:

```
NEXT_PUBLIC_ENABLE_HIRING_QA=true
```

Then run:

```
npx playwright test tests/hiringDecisionsQA.spec.ts
BASE=http://localhost:3000 node tools/smoke.mjs
```

Rollback: set `NEXT_PUBLIC_ENABLE_HIRING_QA=false` and redeploy.

Notes: mock/test only, no live applicant impact.

### Payments Integration (Flagged)

- `NEXT_PUBLIC_ENABLE_PAYMENTS` – master switch for payments UI.
- `NEXT_PUBLIC_ENABLE_GCASH` – enable GCash option.
- `NEXT_PUBLIC_ENABLE_STRIPE` – enable Stripe card option.
- `NEXT_PUBLIC_ENABLE_PAYMENTS_LIVE` – switch to live Stripe/GCash keys.

Enable locally by setting in `.env.local`:

```
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_ENABLE_GCASH=true
NEXT_PUBLIC_ENABLE_STRIPE=true
STRIPE_TEST_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_TEST_SECRET_KEY=sk_test_xxx
```

With flags on, checkout flows show GCash QR upload and Stripe sandbox card (4242 4242 4242 4242).

Rollback: set `NEXT_PUBLIC_ENABLE_PAYMENTS=false` and redeploy.

### Payments Live Rollout

- `NEXT_PUBLIC_ENABLE_PAYMENTS_LIVE` – use production Stripe and GCash credentials.
- `STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` – live Stripe keys.
- `GCASH_MERCHANT_ID` / `GCASH_API_KEY` – GCash production credentials.

Enable locally by setting in `.env.local` along with the flags above:

```
NEXT_PUBLIC_ENABLE_PAYMENTS_LIVE=true
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
GCASH_MERCHANT_ID=your_id
GCASH_API_KEY=your_key
```

Testing:

```
BASE=http://localhost:3000 NEXT_PUBLIC_ENABLE_PAYMENTS=true NEXT_PUBLIC_ENABLE_PAYMENTS_LIVE=true npm run smoke
```

Rollback: set `NEXT_PUBLIC_ENABLE_PAYMENTS_LIVE=false` to return to sandbox mode.

## Staging auth & engine flows

Engine-backed auth and data wiring is gated behind flags and off by default.

```
NEXT_PUBLIC_ENABLE_ENGINE_AUTH=false
NEXT_PUBLIC_ENABLE_ENGINE_PROFILE=false
NEXT_PUBLIC_ENABLE_ENGINE_APPS=false
NEXT_PUBLIC_ENABLE_ENGINE_APPLY=false
```

Enable in `.env.local` along with `ENGINE_MODE=php` to exercise real engine
login, profile and applications. Verify with:

```
node tools/smoke_engine_auth.mjs
```

To instantly revert to mock mode, set `ENGINE_MODE=mock` or flip the flags
back to `false`.

Troubleshooting:

- Ensure the `auth_token` cookie is present after login.
- A missing cookie or 401 responses usually indicate CORS or credential issues.
- If the engine times out or returns 5xx, the app falls back to mock flows.

- `NEXT_PUBLIC_ENABLE_INTERVIEWS_UI` – enable interview scheduling UI. When enabled, the app uses `/api/interviews` and `/api/interviews/[id]` for creating and updating interviews. Optional helpers:
  - `NEXT_PUBLIC_INTERVIEW_DEFAULT_METHOD` – default method (`video`, `phone`, `in_person`).
  - `NEXT_PUBLIC_INTERVIEW_SLOT_MINUTES` – default duration in minutes.
  - `INTERVIEWS_WEBHOOK_URL` – POST webhook on create/update (best effort).
- `NEXT_PUBLIC_ENABLE_INTERVIEWS` – master switch for interview features.
- `NEXT_PUBLIC_ENABLE_INTERVIEW_INVITES` – enable calendar invites with signed RSVP links.
- `INVITES_FROM` / `INVITES_REPLY_TO` – from and reply-to addresses for invites.
- `NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS` – send reminder emails before an interview.
- `REMINDER_LEAD_HOURS` – hours ahead of start to send reminders.
- `NEXT_PUBLIC_ENABLE_SETTINGS` – enable account settings page under `/settings`. Stores preferences in a signed `settings_v1` cookie mirrored to `localStorage` for instant reloads. In `ENGINE_AUTH_MODE=php`, requests proxy to `${ENGINE_BASE_URL}/api/settings`.
- `NEXT_PUBLIC_DEFAULT_LANG` – default language (`en` or `tl`) used when no user settings exist.
- `NEXT_PUBLIC_DEFAULT_EMAIL_PREFS` – initial email preference (`ops_only`, `all`, `none`).
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

## Interview Invites & Reminders (flagged)

Disabled by default. To exercise end-to-end locally:

1. Set in `.env.local`:
   ```env
   NEXT_PUBLIC_ENABLE_INTERVIEWS=true
   NEXT_PUBLIC_ENABLE_INTERVIEW_INVITES=true
   NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS=true
   NEXT_PUBLIC_ENABLE_EMAILS=true
   ```
2. Create an interview then `POST /api/interviews/{id}/invite` to send emails
   with a minimal RFC5545 calendar attachment and signed RSVP links.
3. `POST /api/interviews/remind-due` sends reminders
   `REMINDER_LEAD_HOURS` before `startISO`.

The ICS helper is lightweight and uses no external packages.

## Account Settings & Preferences (flagged)

Disabled by default. Configure via environment:

```
NEXT_PUBLIC_ENABLE_SETTINGS=false
NEXT_PUBLIC_DEFAULT_LANG=en
NEXT_PUBLIC_DEFAULT_EMAIL_PREFS=ops_only   # ops_only | all | none
NEXT_PUBLIC_DEFAULT_ALERTS_FREQUENCY=weekly # daily | weekly
```

Enable locally by setting `NEXT_PUBLIC_ENABLE_SETTINGS=true`. When also running with `ENGINE_MODE=php`, settings are persisted through the engine; otherwise they fall back to a localStorage mock and behave identically.

Roll back any time by turning the flag off.

## Job Closeout (flagged)

Disabled by default. Configure via environment:

```env
NEXT_PUBLIC_ENABLE_JOB_CLOSEOUT=false
NEXT_PUBLIC_ENABLE_BULK_REJECTION_EMAILS=false
```

Enable by setting `NEXT_PUBLIC_ENABLE_JOB_CLOSEOUT=true`. Employers can mark a job as filled or closed and optionally bulk notify remaining applicants. Emails are sent only when `NEXT_PUBLIC_ENABLE_BULK_REJECTION_EMAILS=true` and user preferences permit.

Rollback: turn the flags off. In engine mode, bulk rejection actions are irreversible, so exercise caution.

## Buttons/Links Sanity Checker (flagged, dev-only)

- `NEXT_PUBLIC_ENABLE_LINK_MAP_SANITY` – when `true`, runs a development-only scan of navbar, footer, and primary CTAs to ensure links point to valid routes. Logs warnings only.

Enable locally by setting in `.env.local`:

```env
NEXT_PUBLIC_ENABLE_LINK_MAP_SANITY=true
```

Rollback: set `NEXT_PUBLIC_ENABLE_LINK_MAP_SANITY=false` and redeploy. Dev-only and non-blocking.

## Hiring Decisions (flagged)

Disabled by default. Configure via environment:

```env
NEXT_PUBLIC_ENABLE_HIRING=false
NEXT_PUBLIC_ENABLE_HIRING_EMAILS=false
```

Enable locally by setting `NEXT_PUBLIC_ENABLE_HIRING=true`. With `ENGINE_MODE=php` the app proxies hiring actions to the engine; otherwise a mock store is used. The basic flow:

1. Employer posts an offer with optional start date, rate and notes.
2. Applicant accepts or declines the offer.
3. Employer may mark the applicant hired or not selected.

To smoke test locally after enabling the flag:

```bash
node tools/smoke_hiring.mjs
```

Roll back any time by turning the flag off.
## Notifications Center (flagged)

Disabled by default. Enable locally by adding to `.env.local`:

```env
NEXT_PUBLIC_ENABLE_NOTIFICATION_CENTER=true
NOTIFS_POLL_MS=30000
NOTIFS_PAGE_SIZE=20

# unified notifications (new)
NEXT_PUBLIC_ENABLE_NOTIFY_CENTER=true
NEXT_PUBLIC_NOTIFY_SRC_MESSAGES=true   # toggle others as needed
NEXT_PUBLIC_ENABLE_SOCKETS=true
EVENTS_POLL_MS=5000
```

When enabled, a bell appears in the navbar with unread counts and a `/notifications` page lists all messages, applications, interviews, alerts and admin notices. In `ENGINE_MODE=mock`, notifications are stored in a signed `notifs` cookie; with `ENGINE_AUTH_MODE=php` requests proxy to `${ENGINE_BASE_URL}/api/notifications`.

The unified center exposes `/api/notify/index` returning `{ items, counts }`. Trigger a mock event with `POST /api/notify/mock` then re-fetch `/api/notify/index` to see counts increment.

If `NEXT_PUBLIC_ENABLE_SOCKETS` is true the center uses SSE for live updates; otherwise it polls every `NOTIFS_POLL_MS` milliseconds (or `EVENTS_POLL_MS` for the new API).

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

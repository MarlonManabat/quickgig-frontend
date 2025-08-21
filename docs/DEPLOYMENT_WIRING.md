# Deployment wiring (Landing → App → Supabase)

## Supabase (Dashboard)

- Auth → URL Configuration
  - **Site URL:** https://app.quickgig.ph
  - **Additional Redirect URLs:**
    https://app.quickgig.ph/_, https://quickgig.ph/_, https://www.quickgig.ph/*
- Settings → API → **Allowed Origins (CORS):**
  https://quickgig.ph, https://www.quickgig.ph, https://app.quickgig.ph
- (Optional) Auth email templates: ensure links point to https://app.quickgig.ph
- (Optional) SMTP for noreply@quickgig.ph; ensure SPF/DKIM set in Hostinger.

## Vercel (App project)

- Settings → Domains: app.quickgig.ph attached and ready
- Settings → Environment Variables:
  - `NEXT_PUBLIC_SUPABASE_URL` = (project URL)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (anon public)
  - `SUPABASE_SERVICE_ROLE_KEY` = (server-only)
  - `NEXT_PUBLIC_SITE_URL` = https://app.quickgig.ph
  - (optional) `NEXT_PUBLIC_STORAGE_BUCKET` = assets
  - (optional) `RESEND_API_KEY`, `NOTIFY_FROM`, `APP_URL`
- Redeploy after saving envs.

## Hostinger (Root landing at quickgig.ph)

- Upload contents of `/landing_public_html/` to `public_html/`
- If `index.php` exists, remove it so `index.html` takes over.
- `.htaccess` here forwards common routes to the app subdomain.

## Applications MVP

- Run migration: `supabase/migrations/2025-08-21-applications.sql`

## Realtime messages

- Run migration: `supabase/migrations/2025-08-21T_realtime_messages_and_reads.sql` (enable Realtime on messages and track per-user read markers)
- Requires publication `supabase_realtime`

## Notifications

- Run migration: `supabase/migrations/2025-08-22_notifications.sql`

## Supabase health check

- Endpoint: `/api/health` (Pages API)

## Smoke test

- From quickgig.ph click **Sign Up** → app.quickgig.ph
- Complete signup → magic link opens app.quickgig.ph (not root)
- Check Supabase `profiles` row for the new user
- Try https://quickgig.ph/login and /post → 302 to app
- As owner, open application list then a specific application thread
- As worker in another browser, send a message on that application
- Owner thread updates without refresh and unread indicator clears after viewing
- Application list shows a dot for unread messages and clears after opening
- A sends Worker a message → Worker sees bell dot & dropdown updates live
- Worker opens dropdown → dot clears
- Owner sends offer → Worker gets `offer` notification; accept → both get `hired`
- `/api/health` returns ok

# Deployment wiring (Landing → App → Supabase)

## Supabase (Dashboard)

- Auth → URL Configuration
  - **Site URL:** https://app.quickgig.ph
  - **Additional Redirect URLs:**
    https://app.quickgig.ph/*, https://quickgig.ph/*, https://www.quickgig.ph/*
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
- Redeploy after saving envs.

## Hostinger (Root landing at quickgig.ph)

- Upload contents of `/landing_public_html/` to `public_html/`
- If `index.php` exists, remove it so `index.html` takes over.
- `.htaccess` here forwards common routes to the app subdomain.

## Smoke test

- From quickgig.ph click **Sign Up** → app.quickgig.ph
- Complete signup → magic link opens app.quickgig.ph (not root)
- Check Supabase `profiles` row for the new user
- Try https://quickgig.ph/login and /post → 302 to app

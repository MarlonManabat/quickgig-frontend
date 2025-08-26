# QuickGig — Go Live (Vercel + Supabase + Hostinger)

## Vercel (app.quickgig.ph)

- Project: quickgig-frontend → Settings → Domains → ensure app.quickgig.ph is Production
- Environment Variables (Production & Preview):
  - NEXT_PUBLIC_SITE_URL=https://app.quickgig.ph
  - NEXT_PUBLIC_SUPABASE_URL=…
  - NEXT_PUBLIC_SUPABASE_ANON_KEY=…
  - SUPABASE_SERVICE_ROLE_KEY=… (Server)
- Redeploy → visit /api/health → expect { ok: true }

## Supabase

- Auth → URL Configuration
  - Site URL: https://app.quickgig.ph
  - Redirects: https://app.quickgig.ph (add Vercel preview domain if needed)
- Storage: “assets” bucket is Public
- Emails (optional): set From name/address; configure SPF/DKIM in Hostinger if sending from your domain

## Hostinger (Landing: quickgig.ph)

- Upload landing bundle to /public_html
- Put .htaccess rules (see docs/HOSTINGER_HTACCESS.sample)
- DNS: root/WWW → Hostinger; CNAME “app” → Vercel
- Verify CTAs (Login / Signup / Jobs / Post Job) open https://app.quickgig.ph/…

## Smoke Tests

- https://app.quickgig.ph/api/health → { ok: true }
- Verify email login redirect back to app
- Upload a file → stored under assets bucket and publicly loads

## Rollback

- Revert Hostinger .htaccess
- Redeploy previous Vercel build from the dashboard

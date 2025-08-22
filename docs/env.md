# Environment Variables

Fill these in `.env.local` (never commit secrets):

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Client Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: Server actions (admin-only), never shipped to client.
- `NEXT_PUBLIC_SITE_URL`: e.g., https://quickgig.ph
- `GCASH_*`: Display-only for manual payments (soft launch).
- `EMAIL_FROM`: Optional; used by email logging/stubs.

Deploy notes (Vercel): add the same keys in Project → Settings → Environment Variables.

# Environment Variables

Fill these in `.env.local` (never commit secrets):

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Client Supabase.
- `SUPABASE_SERVICE_ROLE`: Server actions (admin-only), never shipped to client.
- `NEXT_PUBLIC_SITE_URL`: e.g., https://quickgig.ph
- `NEXT_PUBLIC_TICKET_PRICE_PHP` (default 20) and `FREE_TICKETS_ON_SIGNUP` (default 3).
- `GCASH_PAYEE_NAME`, `GCASH_NUMBER`, `NEXT_PUBLIC_GCASH_QR_URL`, `GCASH_NOTES`: Display info for manual payments.
- `SEED_ADMIN_EMAIL`: Promote this user to admin via `/api/admin/seed`.
- `EMAIL_FROM`: Optional; used by email logging/stubs.

Deploy notes (Vercel): add the same keys in Project → Settings → Environment Variables.

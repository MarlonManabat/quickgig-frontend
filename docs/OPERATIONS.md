# Operations Checklist

## Smoke tests
- `npm run smoke:local`
- `npm run smoke:prod`

## Environment variables
Ensure the following are configured:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_EMAILS`
- `GCASH_QR_URL`
- `TICKET_PRICE_PHP`

## Deploy
- Push to main branch.
- Vercel deploy preview and production.

## Supabase Audit
- Run `npm run db:print:audit` and review recent logs.

# Minimal ops

## Local

1. `cp .env.example .env.local` and fill Supabase URL/anon key.
2. `npm run dev`
3. `npm run smoke:local` → expect `{ "ok": true }` in body.

## Production

- `npm run smoke:prod` (hits https://app.quickgig.ph/api/health)

If smoke fails, verify Vercel envs:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_STORAGE_BUCKET=assets

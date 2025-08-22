# Payments Setup

## Environment
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://app.quickgig.ph`)

## Stripe CLI (local)
```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Supabase
Run migration:
```
supabase/migrations/2025-08-22_payments.sql
```

## Smoke Test
1. Owner → Settings/Payouts → Connect → complete onboarding (test mode) → webhook updates profile → status shows ✅.
2. Attempt to create an offer when not payout_ready → blocked by UI; if bypassed, DB RLS prevents it.
3. Notification `payout_ready` appears when webhook flips the flag.

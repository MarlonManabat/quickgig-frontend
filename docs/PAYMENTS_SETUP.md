# Payments Setup

## Environment Variables

Set the following in Vercel Project Settings → Environment Variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (e.g., `https://app.quickgig.ph`)

After setting these, redeploy with **Clear build cache**.

## Local Smoke Test

```sh
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger account.updated
```

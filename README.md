# QuickGig Frontend

Minimal Next.js app using Supabase for authentication, profiles and gig postings.

## Environment

Define in Vercel (and `.env.local` for local dev):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

For CI runs, configure the variables listed in `.env.example.ci` as repository secrets so Playwright tests can seed state.

## Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm start` - run production build

## Testing

```bash
# Optional: provide demo emails for smoke specs
export DEMO_USER_EMAIL="qa-user@example.com"
export DEMO_ADMIN_EMAIL="qa-admin@example.com"
```

## Smoke tests

```
curl -X POST https://app.quickgig.ph/api/orders
curl -X POST -H "Content-Type: application/json" -d '{"proof_url":"https://.../receipt.jpg"}' https://app.quickgig.ph/api/orders/<id>/submit
curl -X POST -H "Content-Type: application/json" -d '{"decision":"paid"}' https://app.quickgig.ph/api/orders/<id>/decide
curl https://app.quickgig.ph/api/users/me/eligibility
```

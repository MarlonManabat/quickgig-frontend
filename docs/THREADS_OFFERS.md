# Threads & Offers

## Runbook

1. **Run the SQL** in Supabase SQL Editor once (paste [`docs/sql/2025-threads-offers.sql`](./sql/2025-threads-offers.sql)).
2. No server keys needed; all access is via RLS with the logged-in user.

### Manual Smoke Flow

1. User A (owner): Post a gig.
2. User B (worker): Apply to the gig.
3. Owner: Open application → send message → create offer.
4. Worker: See thread → reply → Accept offer → status becomes **hired**.
5. Health endpoint unchanged.

## Running Locally

```bash
npm install
npm run dev
```

Screenshots: _TBD_

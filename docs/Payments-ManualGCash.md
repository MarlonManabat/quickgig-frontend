# Manual GCash Payments

This feature gates job posting behind a manual payment review.

## Enable the paywall

Set `NEXT_PUBLIC_REQUIRE_PAYMENT=true` in your environment (see `.env.example`). When unset or `false`, the site allows posting jobs without payment.
Configure ticket pricing and bonus via `TICKET_PRICE_PHP` (default ₱20) and `FREE_TICKETS_ON_SIGNUP` (default 3). GCash instructions are driven by `GCASH_PAYEE_NAME`, `GCASH_NUMBER`, `GCASH_QR_URL`, and optional `GCASH_NOTES`.

## Database setup

Run the migration [`20250822_manual_gcash.sql`](../supabase/migrations/20250822_manual_gcash.sql) in the Supabase SQL editor. It creates an `orders` table and a `payment-proofs` storage bucket.

## Admin approval

Set `profiles.admin = true` for reviewer accounts. Visit `/admin/orders` to approve or reject uploaded proofs.

## Security notes

- Row Level Security policies restrict access so users only manage their own orders.
- The `payment-proofs` bucket is private. The code currently uses public URLs for convenience; consider signed URLs for production.

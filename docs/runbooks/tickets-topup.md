# Tickets Top-Up via GCash

Manual GCash top-up flow for purchasing ticket packages.

## Schema

See migration `supabase/migrations/20251016000000_tickets_topup.sql` which creates `ticket_orders` with
`pending | approved | rejected` statuses.

## Storage

Create a `receipts` bucket in Supabase storage. Owners can read/write their own files; admins can read all.

## Admin RPCs

- `tickets_admin_approve_order(order_id uuid, note text = null)` — marks order approved, grants tickets, returns new balance.
- `tickets_admin_reject_order(order_id uuid, note text)` — marks order rejected.

Both functions should run as SECURITY DEFINER and rely on existing admin checks.

## Env / Config

- `ADMIN_EMAILS` for admin access.
- `SUPABASE_SERVICE_ROLE_KEY` required for admin API routes.

## Manual Approval Steps

1. User creates order on `/tickets/buy` and uploads receipt to `receipts` bucket.
2. Admin reviews order on `/admin/tickets` and approves or rejects with a note.
3. On approval, tickets are credited and header balance updates via `/api/tickets/balance`.

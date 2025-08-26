# Support & Account Deletion

## Support

- Users submit at `/support`. Tickets land in `public.support_tickets`.
- Admins can view via `/admin` (future: dedicated list), and close via RPC `admin_close_ticket(id)`.

## Account Deletion

- User clicks "Delete my account" at `/settings/account`.
- We set `profiles.delete_requested_at` and `deleted_at` (soft delete), suspend access.
- After **ACCOUNT_RETENTION_DAYS** (default 30), run `purge_user_content(user_id, days)` to erase jobs/messages.
- Hard-delete auth identity can be done by ops using Supabase dashboard or a secure server function (service role), not in client.

## Compliance Notes

- Deletion is staged to allow dispute resolution and fraud checks.
- Users are signed out immediately after requesting deletion.
- Support can re-enable in rare cases by clearing `deleted_at` & `suspended_at`.

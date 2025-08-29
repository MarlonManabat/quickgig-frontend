# Manual GCash Top-up

Finance operators review manual GCash payments via the `orders` table and `payments` storage bucket.

1. Users submit proofs via the app (uploaded to `payments` bucket under `proofs/{user_id}/`).
2. Visit `/admin/orders` to see pending orders.
3. Approve to grant credits via the `admin_approve_order` RPC.
4. Files remain private in the `payments` bucket.

Price per bundle is configured by `NEXT_PUBLIC_TICKET_PRICE_PHP` (default ₱99 for 3 credits).

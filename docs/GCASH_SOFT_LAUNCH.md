# GCash Soft Launch

Operator steps to enable manual GCash ticketing.

1. **Environment**
   - Set `ADMIN_EMAILS` with comma separated admin accounts.
   - Set `GCASH_QR_URL` pointing to the QR image in Supabase storage or `/assets/gcash-qr.png`.
   - Set `TICKET_PRICE_PHP` (default `10`).
2. **Upload QR**
   - Upload the QR image to the `assets` bucket and note the public URL.
3. **Review Order Queue**
   - Visit `/admin/orders` to view pending orders.
   - Each order shows reference, user and proof screenshot.
4. **Approve/Reject**
   - Approve (`paid`) or reject orders. Rejected orders may re‑upload new proof.
5. **Gate Posting**
   - Users can post jobs only after an order is approved.


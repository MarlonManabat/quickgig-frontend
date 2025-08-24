# Manual GCash Soft-launch

## QR Upload
- Place the GCash QR at `public/assets/gcash-qr.png` or upload to Supabase storage and set the public URL in `GCASH_QR_URL`.

## Environment
Set in Vercel:
- `TICKET_PRICE_PHP` (₱20 default)
- `FREE_TICKETS_ON_SIGNUP` (3)
- `GCASH_PAYEE_NAME`, `GCASH_NUMBER`, `GCASH_QR_URL`, `GCASH_NOTES`
- `ADMIN_EMAILS`
- `NEXT_PUBLIC_SITE_URL`

## Admin Review
1. User creates order and submits payment proof.
2. Admin visits `/admin/orders` to review.
3. Approve to mark as `paid` or reject to ask for re-upload.

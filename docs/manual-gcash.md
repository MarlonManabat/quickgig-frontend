# Manual GCash Top-up

Finance operators can review manual GCash payments in the Supabase `payment_proofs` table and the `gcash-proofs` storage bucket.

1. Users submit proofs via the app.
2. Visit `/admin/billing` to see pending proofs.
3. Approve to grant credits via the `grant_credits` RPC or reject with a note.
4. Files are stored in the private `gcash-proofs` bucket.

Price per credit: ₱100.

# Infra

## Supabase migrations

Changes to SQL files under `supabase/migrations` are applied automatically when code is pushed to `main`.
The `Supabase migrations` GitHub workflow links the project and runs `supabase db push` against the live database.

### Manual fallback

If the workflow fails or you need to run a migration manually, open Supabase Studio and use the SQL editor to execute the migration contents.

### Buckets

The migrations provision public buckets `avatars` and `payment-proofs`. They are public for the MVP;
`payment-proofs` will move to signed URLs later.

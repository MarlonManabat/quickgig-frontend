# Credits DB Migration

To apply the credits migration:

1. Generate SQL with:

   ```bash
   npm run db:print:a
   ```

2. Review the output and apply to your database using the Supabase CLI or dashboard.

The migration creates the `user_credits` table, initializes credits for new users, and exposes RPCs to decrement and grant credits.

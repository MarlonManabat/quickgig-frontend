Open Supabase → SQL Editor → paste `supabase/migrations/2025-08-22_supabase_audit.sql` → **RUN**.

Re-run if needed; it’s idempotent.

Manual checks (non-SQL):
- Auth → URL Configuration: `Site URL=https://app.quickgig.ph`, Redirects include `https://app.quickgig.ph`, `https://www.quickgig.ph`.
- If Realtime still doesn’t stream, toggle **Database → Replication → Publications → supabase_realtime** and ensure listed tables are attached.

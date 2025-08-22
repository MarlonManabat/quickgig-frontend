# DB Setup (Supabase)

## Install CLI
```bash
npm i -g supabase
```

## Local dev (optional)

```bash
supabase start
supabase db reset --force   # wipes local db
supabase db apply           # applies all migrations
```

## Production

Migrations are **idempotent**. Apply via CI or:

* Ensure `DATABASE_URL` points to your Supabase Postgres.
* Run the SQL from `/supabase/migrations/*_audit.sql`.

### Notes

* RLS is enabled on all tables.
* Policies reference `auth.uid()` and helper `is_admin()`.
* Service role bypasses RLS (server-only actions).
* Trigger `on_auth_user_created` (see `20250822_profiles_bootstrap_audit.sql`) auto-inserts rows into `public.profiles` for new `auth.users` to satisfy FK and RLS requirements.

- 20250822_add_published_to_gigs_audit.sql: adds `gigs.published` and a trigger to sync with `status`. Legacy code that queries `published` now works; new code should prefer `status` ('draft'|'published'|'closed').

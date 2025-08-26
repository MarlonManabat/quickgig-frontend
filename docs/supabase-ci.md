# Supabase CI

This workflow pulls the live Supabase database schema into the repo so migrations and application code stay in sync.

## Required GitHub secrets

- `SUPABASE_ACCESS_TOKEN` – create from your Supabase account settings
- `SUPABASE_PROJECT_REF` – e.g. `duhczsmefhdvhohqlwig`

No database password is required for `supabase db pull`.

## How to trigger

1. Go to **Actions → "Supabase schema pull" → Run workflow**
2. The workflow logs in, links the project, and runs `supabase db pull`.
3. It opens a PR with the pulled schema changes for review.

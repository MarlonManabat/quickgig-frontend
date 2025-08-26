# Release check

This workflow seeds deterministic QA data and runs smoke and full end‑to‑end tests against a Vercel preview deployment.

## Required secrets

- `VERCEL_TOKEN`
- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_ID` (optional)
- `QA_TEST_EMAIL`
- `QA_TEST_SECRET`
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## How to run

1. Push your changes and open a Pull Request.
2. In GitHub select **Actions → Release check → Run workflow** and target the PR.
3. The job waits for the preview, seeds the database, runs smoke and e2e tests, and posts a summary comment with links to the preview and test artifacts.


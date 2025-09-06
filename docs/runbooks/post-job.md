# Post Job Runbook

## Flow
1. Employer visits `/post-job`.
2. If not signed in, middleware redirects to `/login?next=/post-job` (considered success in smoke).
3. Signed-in users see the Post Job form and submit with title, description, category, region, and city.
4. The API `POST /api/jobs/create` stores the job with `status='published'` by default.
5. After successful submission, the client redirects to `/jobs/{id}` and the page root carries `data-qa="post-job-success"`.
6. `/browse-jobs` queries Supabase for `status='published'` jobs so the new post appears quickly.

## RLS Policies
Policies are defined in `supabase/migrations/*_jobs_post_e2e.sql`:
- Select published jobs or own drafts.
- Insert only as the authenticated user.
- Update allowed for owner or admin (publish/unpublish).

## Smoke behavior
- Without credentials, redirect to `/login?next=/post-job` counts as pass.
- With `E2E_EMPLOYER_EMAIL`/`PASSWORD`, smoke posts a real job and asserts it appears on `/browse-jobs`.

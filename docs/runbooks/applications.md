# Applications Runbook

Workers can apply to published jobs once. This runbook covers the schema, RLS policies, API endpoints, and UI surfaces for the Apply and My Applications flows.

## Database

Table: `public.applications`

- `id uuid primary key`
- `job_id uuid` → `public.jobs.id`
- `worker_id uuid` → `public.profiles.id`
- `cover_note text`
- `status text` (`applied` · `under_review` · `shortlisted` · `offered` · `hired` · `rejected` · `withdrawn`)
- `created_at timestamptz`
- `updated_at timestamptz`
- Unique `(job_id, worker_id)`

Indexes: `worker_id`, `job_id`

RLS policies allow workers to insert/select/update their own rows.

## API

### `POST /api/applications/create`

Request: `{ jobId, coverNote? }`

- Inserts a new application for the authenticated user.
- `409 { code: 'DUPLICATE_APPLICATION' }` on unique violation.

### `GET /api/applications/me`

Returns the caller's applications with joined job info.

```json
{ "applications": [ { "id": "…", "status": "applied", "created_at": "…", "job": { "id": "…", "title": "…" } } ] }
```

## UI

- **Job detail**: signed-in workers see an Apply button (`data-cta="apply-open"`) that opens a modal form. Unsigned users are redirected to `/login?next=/applications`.
- **Applications page** `/applications`: lists `{job title, status, created_at}`. When empty, renders `data-qa="applications-empty"` with CTA `data-cta="browse-jobs-from-empty"` → `/browse-jobs`.

## Smoke

`tests/smoke/apply-flow.spec.ts` exercises the path end-to-end. The test passes when:

1. Clicking Apply while signed out redirects to `/login?next=/applications`.
2. With test creds set, submitting the form lands in `/applications` and the job title appears.
3. Visiting `/applications` with no data shows the empty state.

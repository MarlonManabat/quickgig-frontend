# Applications API

Workers can apply to open jobs once.

## Endpoint

`POST /api/applications/create`

### Request body

```json
{
  "jobId": "<job uuid>",
  "message": "<at least 20 characters>",
  "expectedRate": 1000
}
```

### Success response

`201 Created`

```json
{ "id": "<application uuid>" }
```

### Error responses

- `400 { "error": { "code": "VALIDATION_FAILED", "fields": { ... } } }`
- `400 { "error": { "code": "JOB_CLOSED" } }`
- `400 { "error": { "code": "DUPLICATE_APPLICATION" } }`
- `401 { "error": { "code": "UNAUTHORIZED" } }`

## Row Level Security

- Workers may insert their own application if the job is open.
- Workers can read their own applications.
- Employers can read applications for their jobs.

## Closing a job

Set `is_closed` to `true` in the `jobs` table to prevent new applications.

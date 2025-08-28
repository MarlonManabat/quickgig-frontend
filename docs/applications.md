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

## Application lifecycle

`submitted` → `accepted` / `declined` → (future `withdrawn`).

## Employer actions

From the job detail page, employers can review each application and set it to
**accepted** or **declined**. They may also close the job, which sets
`is_closed=true` and prevents new applications.

## Notifications

When an employer updates an application status, a notification is created for
the worker:

```json
{
  "type": "application_status",
  "title": "Application status updated",
  "body": "Your application was accepted.",
  "link": "/applications/<id>"
}
```

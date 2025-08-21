# Moderation & Reports

## Admin allowlist

Set `ADMIN_EMAILS` in your environment (comma-separated emails) to allow admin access.

```
# .env
ADMIN_EMAILS=you@quickgig.ph,admin@quickgig.ph
```

## Reporting content

Users can report gigs, profiles, or messages. Each page shows a **Report** link that submits to `/api/reports/create`.

## Admin dashboard

Visit `/admin/moderation` with an allowlisted email to view recent reports and manage hidden gigs or profiles. Actions are sent to `/api/admin/moderation`.

## Hidden & blocked

- Hidden gigs or profiles are not shown in listings.
- Blocked profiles indicate banned users.
- A row-level security policy prevents new applications to hidden gigs.

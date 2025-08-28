# Messaging

## Schema

- `messages`
  - `id` UUID primary key
  - `application_id` references `applications.id`
  - `sender_id` references `profiles.id`
  - `body` text 1-4000 chars
  - `created_at` timestamp
- Optional `message_reads` for read receipts

## Row Level Security

Only the worker and employer involved in the application may select or insert messages.
Policies enforce `auth.uid()` matches either the worker or the job's employer.

## Realtime

Subscribe to the channel `messages:<applicationId>` using Supabase Realtime:

```
supabase.channel(`messages:${applicationId}`)
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `application_id=eq.${applicationId}` }, handler)
  .subscribe();
```

## Notifications

Each new message inserts a notification for the other participant with type `message_new` and a link to `/applications/<id>`.
The navbar listens for notification inserts and shows an unread badge.

## Rate limiting

Message sends are limited to 15 per user per minute. Exceeding the limit returns `RATE_LIMITED`.

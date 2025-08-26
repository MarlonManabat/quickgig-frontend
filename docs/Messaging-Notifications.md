# Messaging & Notifications

## Realtime subscription

Threads use a Supabase Realtime channel to receive new messages. `subscribeToThread`
opens a channel scoped to the thread and pushes inserts to the hook so the UI updates
instantly.

## Optimistic send

`MessageComposer` appends a temporary message to the list before inserting into the
`messages` table. On completion it replaces the optimistic row with the stored row,
or logs an error if the insert fails.

## Notifications fallback

The notifications page attempts to read from a dedicated `notifications` table. If
the table is absent it derives a list from recent messages directed at the current
user within the last 24 hours, producing simple “message” notification items.

## DB audit

Idempotent SQL for the messaging tables lives in
`/supabase/migrations/20250822_messaging_audit.sql`. Run it in the Supabase SQL
editor; existing tables are preserved and indexes are created if missing. RLS and
policies depend on your current model.

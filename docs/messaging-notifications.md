# Messaging & Notifications

## Access
- Conversations are between the applicant and the gig owner. Administrators can also view threads.
- Users without access see a friendly permission message.

## Messaging
- Threads autoload existing messages and subscribe to Postgres realtime for new ones.
- Sending a message updates the UI optimistically and scrolls to the bottom.
- If row level security blocks sending, users see “You can’t send messages in this application.”

## Notifications
- Each message insert writes a corresponding `notifications` row for the counterparty.
- The bell polls every 30s and listens for realtime inserts.
- A badge shows the unread count. Opening the drawer marks all as read.
- The drawer lists the latest 20 notifications with time‑ago stamps and deep links to the application.
- `read_at` updates are attempted but ignored safely if the column doesn’t exist.

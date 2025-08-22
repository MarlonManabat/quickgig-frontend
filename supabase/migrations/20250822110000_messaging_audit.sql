-- messages table (idempotent)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null,
  sender_id uuid not null references auth.users(id),
  body text not null,
  created_at timestamptz not null default now()
);
-- indexes
create index if not exists messages_thread_idx on public.messages(thread_id, created_at);
-- (Optional) notifications table if you want a real table instead of derived view
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  type text not null,
  payload jsonb,
  actor uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);


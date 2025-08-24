create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in (
    'offer_sent','offer_accepted','job_completed',
    'gcash_approved','gcash_rejected'
  )),
  title text not null,
  body text not null,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now(),
  uniq_key text unique
);

alter table public.notifications enable row level security;

create policy "users read own notifications" on public.notifications
for select using (auth.uid() = user_id);

create policy "users update own notifications" on public.notifications
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_notifications_user_created
  on public.notifications (user_id, created_at desc);

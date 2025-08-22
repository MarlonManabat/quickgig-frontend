-- Enable Realtime for messages (no-op if already added)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end$$;

-- Per-user last-read markers
create table if not exists public.message_reads (
  app_id uuid not null references public.applications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (app_id, user_id)
);

alter table public.message_reads enable row level security;

-- A user can see/update their own read marker if they are a participant on the application
create policy if not exists "read own read markers"
on public.message_reads
for select
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1 from public.applications a
    where a.id = message_reads.app_id
      and (a.worker_id = auth.uid() or a.owner_id = auth.uid())
  )
);

create policy if not exists "upsert own read markers"
on public.message_reads
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.applications a
    where a.id = message_reads.app_id
      and (a.worker_id = auth.uid() or a.owner_id = auth.uid())
  )
);

create policy if not exists "update own read markers"
on public.message_reads
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

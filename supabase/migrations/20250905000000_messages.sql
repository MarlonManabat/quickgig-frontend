-- Messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete restrict,
  body text not null check (char_length(body) >= 1 and char_length(body) <= 4000),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- RLS: only participants of the application can read/send messages
create policy "participants can select messages"
on public.messages for select
to authenticated
using (
  exists (
    select 1 from public.applications a
    join public.jobs j on j.id = a.job_id
    where a.id = application_id
      and (a.worker_id = auth.uid() or j.employer_id = auth.uid())
  )
);

create policy "participants can insert messages"
on public.messages for insert
to authenticated
with check (
  sender_id = auth.uid() and exists (
    select 1 from public.applications a
    join public.jobs j on j.id = a.job_id
    where a.id = application_id
      and (a.worker_id = auth.uid() or j.employer_id = auth.uid())
  )
);

-- Optional: lightweight read receipts table (future-ready; not required in UI yet)
create table if not exists public.message_reads (
  message_id uuid references public.messages(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (message_id, user_id)
);
alter table public.message_reads enable row level security;
create policy "participants update reads" on public.message_reads
  for insert to authenticated
  with check (exists (
    select 1 from public.messages m
    join public.applications a on a.id = m.application_id
    join public.jobs j on j.id = a.job_id
    where m.id = message_id
      and (a.worker_id = auth.uid() or j.employer_id = auth.uid())
  ));

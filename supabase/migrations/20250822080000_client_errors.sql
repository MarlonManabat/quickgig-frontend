-- Client-side error logs
create table if not exists public.client_errors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id),
  path text,
  message text,
  stack_snippet text,
  ua text,
  release text
);

alter table public.client_errors enable row level security;

create policy if not exists "admin read client errors"
  on public.client_errors for select to authenticated
  using ((select is_admin from public.profiles where id = auth.uid()));

-- No insert policy: inserts use service role

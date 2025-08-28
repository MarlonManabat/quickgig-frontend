create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete restrict,
  message text not null,
  expected_rate numeric not null check (expected_rate > 0),
  status text not null default 'submitted' check (status in ('submitted','withdrawn','declined','accepted')),
  created_at timestamptz not null default now(),
  unique (job_id, worker_id)
);

alter table public.applications enable row level security;

-- Workers can insert their own application if job is open
create policy "worker can insert own application"
on public.applications for insert
 to authenticated
 with check (
  auth.uid() = worker_id
  and exists (
    select 1 from public.jobs j
    where j.id = job_id and coalesce(j.is_closed, false) = false
  )
);

-- Workers can read their own apps; employers can read apps to their jobs
create policy "worker read own applications"
on public.applications for select
 to authenticated
 using (auth.uid() = worker_id);

create policy "employer read apps for their jobs"
on public.applications for select
 to authenticated
 using (exists (
  select 1 from public.jobs j
  where j.id = job_id and j.owner_id = auth.uid()
));

alter table public.jobs add column if not exists is_closed boolean not null default false;

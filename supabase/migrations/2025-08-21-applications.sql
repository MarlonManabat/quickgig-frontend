-- Applications table
create table if not exists public.applications (
  id bigint generated always as identity primary key,
  gig_id bigint not null references public.gigs(id) on delete cascade,
  worker uuid not null references auth.users(id) on delete set null,
  cover_letter text,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now()
);

-- helpful indexes
create index if not exists applications_gig_id_idx on public.applications(gig_id);
create index if not exists applications_worker_idx on public.applications(worker);

-- Row Level Security
alter table public.applications enable row level security;

-- Read: worker sees own apps
create policy if not exists "apps: worker select own"
on public.applications for select
using (auth.uid() = worker);

-- Read: gig owner sees applicants for their gigs
create policy if not exists "apps: owner select for own gigs"
on public.applications for select
using (
  exists (
    select 1 from public.gigs g
    where g.id = applications.gig_id and g.owner = auth.uid()
  )
);

-- Insert: worker can apply (self)
create policy if not exists "apps: worker insert self"
on public.applications for insert
with check (auth.uid() = worker);

-- Update: worker can update own (e.g., withdraw)
create policy if not exists "apps: worker update own"
on public.applications for update
using (auth.uid() = worker);

-- Update: gig owner can update status for their gigs
create policy if not exists "apps: owner update status"
on public.applications for update
using (
  exists (
    select 1 from public.gigs g
    where g.id = applications.gig_id and g.owner = auth.uid()
  )
);

-- Delete: worker can delete own application
create policy if not exists "apps: worker delete own"
on public.applications for delete
using (auth.uid() = worker);


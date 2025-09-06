create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  cover_note text,
  status text not null default 'applied' check (status in ('applied','under_review','shortlisted','offered','hired','rejected','withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, worker_id)
);
create index if not exists idx_apps_worker on public.applications(worker_id);
create index if not exists idx_apps_job on public.applications(job_id);

alter table public.applications enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where polname='apps_select_own') then
    create policy apps_select_own on public.applications for select using (auth.uid() = worker_id);
  end if;
  if not exists (select 1 from pg_policies where polname='apps_insert_self') then
    create policy apps_insert_self on public.applications for insert with check (auth.uid() = worker_id);
  end if;
  if not exists (select 1 from pg_policies where polname='apps_update_own') then
    create policy apps_update_own on public.applications for update using (auth.uid() = worker_id);
  end if;
end $$;

create or replace function public.tg_set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists set_updated_at_applications on public.applications;
create trigger set_updated_at_applications before update on public.applications
for each row execute function public.tg_set_updated_at();

-- Ensure fields exist; skip if already present.
alter table public.jobs
  add column if not exists status text not null default 'published' check (status in ('draft','published','unpublished')),
  add column if not exists region text,
  add column if not exists city text,
  add column if not exists category text;

-- RLS: employers can insert their own jobs; everyone can read published.
alter table public.jobs enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where polname='jobs_select_published_or_owner') then
    create policy jobs_select_published_or_owner on public.jobs
      for select using (status='published' or auth.uid() = created_by);
  end if;
  if not exists (select 1 from pg_policies where polname='jobs_insert_owner') then
    create policy jobs_insert_owner on public.jobs
      for insert with check (auth.uid() = created_by);
  end if;
  if not exists (select 1 from pg_policies where polname='jobs_update_owner_admin') then
    create policy jobs_update_owner_admin on public.jobs
      for update using (auth.uid() = created_by or exists (
        select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true
      ));
  end if;
end $$;

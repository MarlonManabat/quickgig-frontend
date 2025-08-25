alter table public.jobs enable row level security;

drop policy if exists "jobs_read_published" on public.jobs;
create policy "jobs_read_published" on public.jobs
  for select using (published = true);

drop policy if exists "jobs_owner_manage" on public.jobs;
create policy "jobs_owner_manage" on public.jobs
  for insert with check (owner = auth.uid())
  , for update using (owner = auth.uid())
  , for delete using (owner = auth.uid());

drop policy if exists "jobs_admin_all" on public.jobs;
create policy "jobs_admin_all" on public.jobs
  for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

alter table public.tickets_ledger enable row level security;

drop policy if exists "tickets_read_own" on public.tickets_ledger;
create policy "tickets_read_own" on public.tickets_ledger
  for select using (user_id = auth.uid());

drop policy if exists "tickets_insert_own" on public.tickets_ledger;
create policy "tickets_insert_own" on public.tickets_ledger
  for insert with check (user_id = auth.uid());

drop policy if exists "tickets_admin_all" on public.tickets_ledger;
create policy "tickets_admin_all" on public.tickets_ledger
  for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

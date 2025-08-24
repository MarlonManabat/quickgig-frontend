-- 1) Enum-ish status via CHECKs (keeps existing table names)
-- applications: pending -> shortlisted -> offered -> hired -> completed | cancelled | rejected
alter table public.applications
  add column if not exists status text not null default 'pending'
  check (status in ('pending','shortlisted','offered','hired','completed','cancelled','rejected'));

-- Optional: timestamps to audit
alter table public.applications
  add column if not exists status_changed_at timestamptz default now();

-- prevent duplicate applications per (gig, applicant)
create unique index if not exists idx_applications_unique_per_gig_applicant
  on public.applications (gig_id, applicant_id);

-- gigs: open -> hired -> completed | cancelled
alter table public.gigs
  add column if not exists lifecycle text not null default 'open'
  check (lifecycle in ('open','hired','completed','cancelled'));

-- 2) Transition helpers (security definer) to enforce legal moves
create or replace function public.app_shortlist(p_app_id uuid)
returns void language plpgsql security definer as $$
declare v_gig public.gigs%rowtype; v_app public.applications%rowtype;
begin
  select * into v_app from public.applications where id = p_app_id for update;
  if v_app is null then raise exception 'application not found'; end if;
  if v_app.status <> 'pending' then raise exception 'illegal transition'; end if;

  select * into v_gig from public.gigs where id = v_app.gig_id for update;
  if v_gig is null then raise exception 'gig not found'; end if;

  -- only gig owner can shortlist
  if v_gig.owner_id <> auth.uid() then raise exception 'forbidden'; end if;

  update public.applications set status='shortlisted', status_changed_at=now() where id = p_app_id;
end $$;

create or replace function public.app_offer(p_app_id uuid)
returns void language plpgsql security definer as $$
declare v_gig public.gigs%rowtype; v_app public.applications%rowtype;
begin
  select * into v_app from public.applications where id = p_app_id for update;
  if v_app is null then raise exception 'application not found'; end if;
  if v_app.status not in ('pending','shortlisted') then raise exception 'illegal transition'; end if;

  select * into v_gig from public.gigs where id = v_app.gig_id for update;
  if v_gig.owner_id <> auth.uid() then raise exception 'forbidden'; end if;

  update public.applications set status='offered', status_changed_at=now() where id = p_app_id;
end $$;

create or replace function public.app_accept(p_app_id uuid)
returns void language plpgsql security definer as $$
declare v_gig public.gigs%rowtype; v_app public.applications%rowtype;
begin
  select * into v_app from public.applications where id = p_app_id for update;
  if v_app is null then raise exception 'application not found'; end if;
  if v_app.status <> 'offered' then raise exception 'illegal transition'; end if;

  -- only the applicant can accept
  if v_app.applicant_id <> auth.uid() then raise exception 'forbidden'; end if;

  -- mark hired
  update public.applications set status='hired', status_changed_at=now() where id = p_app_id;
  update public.gigs set lifecycle='hired' where id = v_app.gig_id and lifecycle='open';
end $$;

create or replace function public.app_complete(p_app_id uuid)
returns void language plpgsql security definer as $$
declare v_app public.applications%rowtype;
begin
  select * into v_app from public.applications where id = p_app_id for update;
  if v_app is null then raise exception 'application not found'; end if;
  if v_app.status <> 'hired' then raise exception 'illegal transition'; end if;

  -- either side can complete for MVP; tighten later with both-sides ack if needed
  if v_app.applicant_id <> auth.uid() and
     (select owner_id from public.gigs where id = v_app.gig_id) <> auth.uid()
  then raise exception 'forbidden'; end if;

  update public.applications set status='completed', status_changed_at=now() where id = p_app_id;
  update public.gigs set lifecycle='completed' where id = v_app.gig_id;
end $$;

create or replace function public.app_cancel(p_app_id uuid)
returns void language plpgsql security definer as $$
declare v_gig public.gigs%rowtype; v_app public.applications%rowtype;
begin
  select * into v_app from public.applications where id = p_app_id for update;
  if v_app is null then raise exception 'application not found'; end if;
  if v_app.status not in ('pending','shortlisted','offered','hired') then
    raise exception 'illegal transition';
  end if;

  -- applicant can withdraw before hired; owner can cancel until completed
  select * into v_gig from public.gigs where id = v_app.gig_id for update;

  if auth.uid() = v_app.applicant_id then
    if v_app.status = 'hired' then raise exception 'cannot withdraw after hire'; end if;
  elsif auth.uid() = v_gig.owner_id then
    -- owner can cancel unless completed
    null;
  else
    raise exception 'forbidden';
  end if;

  update public.applications set status='cancelled', status_changed_at=now() where id = p_app_id;
  -- if gig was hired on this app and is now cancelled, reset gig to open (MVP)
  if v_app.status = 'hired' then
    update public.gigs set lifecycle='open' where id = v_app.gig_id and lifecycle='hired';
  end if;
end $$;

-- 3) RLS: workers see their apps; owners see apps for their gigs; admins see all
alter table public.applications enable row level security;

drop policy if exists "apps_select" on public.applications;
create policy "apps_select" on public.applications
for select using (
  auth.uid() = applicant_id
  or auth.uid() in (select owner_id from public.gigs g where g.id = applications.gig_id)
  or (select is_admin from public.profiles where id = auth.uid())
);

-- Inserts allowed only by authenticated workers (self as applicant)
drop policy if exists "apps_insert" on public.applications;
create policy "apps_insert" on public.applications
for insert with check (auth.uid() = applicant_id);

-- Block direct updates/deletes; use RPCs above
drop policy if exists "apps_block" on public.applications;
create policy "apps_block" on public.applications
for all using (false) with check (false);

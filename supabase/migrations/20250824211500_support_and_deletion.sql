-- 1) Support tickets
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,                 -- user-typed contact (optional; backfill from profiles.email if blank)
  subject text not null,
  body text not null,
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

alter table public.support_tickets enable row level security;

-- Users can create & read own tickets
create policy "support_owner_select" on public.support_tickets
  for select using (auth.uid() = user_id);
create policy "support_owner_insert" on public.support_tickets
  for insert with check (auth.uid() = user_id);

-- Admins can read all
create policy "support_admin_read" on public.support_tickets
  for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- 2) Account deletion markers on profiles
alter table public.profiles
  add column if not exists delete_requested_at timestamptz,
  add column if not exists deleted_at timestamptz;

-- optional: ensure email column exists (from previous PRs we added it)
alter table public.profiles
  add column if not exists email text;

-- 3) Purge helper to delete user-generated content (jobs/messages) after retention window.
-- Adjust table names/foreign keys to your schema.
create or replace function public.purge_user_content(p_user uuid, p_days int default 30)
returns void
language plpgsql
security definer
as $$
begin
  -- Purge jobs created by user (consider business rules; you may want to anonymize instead)
  delete from public.jobs
  where user_id = p_user
    and exists (select 1 from public.profiles pr where pr.id = p_user and pr.deleted_at is not null)
    and now() >= (select pr.deleted_at + (p_days || ' days')::interval from public.profiles pr where pr.id = p_user);

  -- Purge messages (if you have public.messages with sender_id)
  if to_regclass('public.messages') is not null then
    delete from public.messages
    where sender_id = p_user
      and exists (select 1 from public.profiles pr where pr.id = p_user and pr.deleted_at is not null)
      and now() >= (select pr.deleted_at + (p_days || ' days')::interval from public.profiles pr where pr.id = p_user);
  end if;
end;
$$;

-- 4) Request account deletion (soft delete + PII scrub)
create or replace function public.request_account_deletion()
returns void
language plpgsql
security definer
as $$
begin
  -- Mark request time if not already marked
  update public.profiles
     set delete_requested_at = coalesce(delete_requested_at, now())
   where id = auth.uid();

  -- Soft-delete immediately: flip 'deleted_at', suspend account, and scrub lightweight PII visible in profiles
  update public.profiles
     set deleted_at = coalesce(deleted_at, now()),
         suspended_at = coalesce(suspended_at, now()),
         -- Optional: keep email for notifications to confirm; if you prefer, null this out and rely on auth.users
         -- email = null
         -- Add any other PII fields here (display_name, bio, etc.)
         display_name = null,
         bio = null
   where id = auth.uid();
end;
$$;

-- 5) Admin close support ticket
create or replace function public.admin_close_ticket(p_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') then
    raise exception 'forbidden';
  end if;

  update public.support_tickets
     set status = 'closed', closed_at = now()
   where id = p_id;
end;
$$;

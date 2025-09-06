-- Ticketing schema: accounts, transactions, signup grant, and burn RPC
-- Safe to re-run: guarded by IF NOT EXISTS. Uses security definer for writes.

-- 1. Tables
create table if not exists public.ticket_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_transactions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  delta integer not null,        -- +N credit, -N debit
  reason text not null check (char_length(reason) <= 64),
  ref_id text,                   -- agreement id or other reference
  created_at timestamptz not null default now()
);

-- 2. RLS: users can read their own rows; no direct writes
alter table public.ticket_accounts enable row level security;
drop policy if exists "own account" on public.ticket_accounts;
create policy "own account"
  on public.ticket_accounts
  for select
  using (auth.uid() = user_id);

alter table public.ticket_transactions enable row level security;
drop policy if exists "own txns" on public.ticket_transactions;
create policy "own txns"
  on public.ticket_transactions
  for select
  using (auth.uid() = user_id);

-- 3. Signup grant trigger: give 3 tickets to brand-new users
create or replace function public.tickets_grant_initial()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only grant if an account doesn't exist yet (idempotent for replays/imports)
  insert into public.ticket_accounts(user_id, balance)
  values (new.id, 3)
  on conflict (user_id) do nothing;

  -- Only log the signup bonus once
  insert into public.ticket_transactions(user_id, delta, reason)
  select new.id, 3, 'signup_bonus'
  where not exists (
    select 1 from public.ticket_transactions
    where user_id = new.id and reason = 'signup_bonus'
  );

  return new;
end$$;

-- Ensure a single trigger instance
drop trigger if exists trg_auth_user_signup_tickets on auth.users;
create trigger trg_auth_user_signup_tickets
after insert on auth.users
for each row execute function public.tickets_grant_initial();

-- 4. Atomic burn for agreements (service-side)
create or replace function public.tickets_burn_on_agreement(
  employer uuid,
  jobseeker uuid,
  agreement_id text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  emp_balance int;
  js_balance  int;
begin
  select balance into emp_balance from public.ticket_accounts where user_id = employer for update;
  select balance into js_balance  from public.ticket_accounts where user_id = jobseeker for update;

  if emp_balance is null then
    raise exception 'employer account missing';
  end if;
  if js_balance is null then
    raise exception 'jobseeker account missing';
  end if;
  if emp_balance <= 0 then
    raise exception 'employer has no tickets';
  end if;
  if js_balance <= 0 then
    raise exception 'jobseeker has no tickets';
  end if;

  update public.ticket_accounts set balance = balance - 1, updated_at = now() where user_id = employer;
  update public.ticket_accounts set balance = balance - 1, updated_at = now() where user_id = jobseeker;

  insert into public.ticket_transactions(user_id, delta, reason, ref_id)
  values (employer, -1, 'agreement', agreement_id),
         (jobseeker, -1, 'agreement', agreement_id);

  return true;
end$$;

-- 5. Permissions: reads for authenticated; RPC only for service role
-- (Supabase grants: service_role can execute everything; explicitly deny anon/auth on RPC)
revoke all on function public.tickets_burn_on_agreement(uuid, uuid, text) from public;
grant execute on function public.tickets_burn_on_agreement(uuid, uuid, text) to service_role;

-- 6. Backfill: ensure existing users have an account & signup bonus once
insert into public.ticket_accounts(user_id, balance)
select id, 3 from auth.users u
left join public.ticket_accounts a on a.user_id = u.id
where a.user_id is null;

insert into public.ticket_transactions(user_id, delta, reason)
select u.id, 3, 'signup_bonus'
from auth.users u
left join (
  select distinct user_id from public.ticket_transactions where reason = 'signup_bonus'
) t on t.user_id = u.id
where t.user_id is null;

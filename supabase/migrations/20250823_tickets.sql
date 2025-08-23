-- 1) admin helper
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce( (select is_admin from public.profiles where id = auth.uid()), false );
$$;

-- 2) tables
create table if not exists public.ticket_balances (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_ledger (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  delta integer not null check (delta <> 0),
  reason text not null,
  ref_id uuid,
  created_at timestamptz not null default now()
);

alter table public.ticket_balances enable row level security;
alter table public.ticket_ledger  enable row level security;

-- 3) RLS
create policy "read own or admin (balances)" on public.ticket_balances
for select using (auth.uid() = user_id or public.is_admin());

create policy "read own or admin (ledger)" on public.ticket_ledger
for select using (auth.uid() = user_id or public.is_admin());

-- no direct writes; use functions
create policy "block writes (balances)" on public.ticket_balances for all
using (false) with check (false);
create policy "block writes (ledger)" on public.ticket_ledger for all
using (false) with check (false);

-- 4) credit/debit functions (security definer)
create or replace function public.credit_tickets_admin(p_user uuid, p_tickets int, p_reason text, p_ref uuid default null)
returns void
language plpgsql security definer as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;
  if p_tickets <= 0 then
    raise exception 'tickets must be positive';
  end if;
  insert into public.ticket_ledger(user_id, delta, reason, ref_id)
  values (p_user, p_tickets, coalesce(p_reason,'admin_credit'), p_ref);
  insert into public.ticket_balances(user_id, balance)
  values (p_user, p_tickets)
  on conflict (user_id) do update set balance = public.ticket_balances.balance + excluded.balance,
                                      updated_at = now();
end; $$;

create or replace function public.debit_tickets(p_user uuid, p_reason text, p_ref uuid default null)
returns boolean
language plpgsql security definer as $$
declare cur int;
begin
  select balance into cur from public.ticket_balances where user_id = p_user for update;
  if cur is null or cur < 1 then
    return false;
  end if;
  update public.ticket_balances set balance = balance - 1, updated_at = now() where user_id = p_user;
  insert into public.ticket_ledger(user_id, delta, reason, ref_id)
  values (p_user, -1, coalesce(p_reason,'hire_debit'), p_ref);
  return true;
end; $$;

-- 5) welcome grant on profile create (employer or everyone; simple MVP)
create or replace function public.grant_welcome_tickets()
returns trigger language plpgsql security definer as $$
declare grant_count int := coalesce( nullif(current_setting('app.welcome_tickets', true),''), '3')::int;
begin
  perform public.credit_tickets_admin(new.id, grant_count, 'welcome_grant', new.id);
  return new;
end; $$;

drop trigger if exists trg_profiles_welcome_tickets on public.profiles;
create trigger trg_profiles_welcome_tickets
after insert on public.profiles
for each row execute function public.grant_welcome_tickets();

-- optional: set default grant via DB setting (override in prod if desired)
alter database postgres set app.welcome_tickets = '3';

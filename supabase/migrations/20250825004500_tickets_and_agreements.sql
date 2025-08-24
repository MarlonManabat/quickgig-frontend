-- 1) LEDGER
create table if not exists public.tickets_ledger (
  id            bigserial primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  delta         integer not null,                 -- +credit / -debit
  reason        text not null,                    -- 'signup_bonus','agree','refund','admin_credit','gcash_credit', etc.
  ref_type      text,                             -- 'agreement','payment','admin'
  ref_id        text,                             -- free-form (agreement id, payment id, etc.)
  created_at    timestamptz not null default now()
);

create index if not exists tickets_ledger_user_created_idx on public.tickets_ledger(user_id, created_at desc);

-- 2) BALANCE VIEW
create or replace view public.tickets_balances as
  select user_id, coalesce(sum(delta), 0)::int as balance
  from public.tickets_ledger
  group by user_id;

-- 3) AGREEMENTS (link worker + employer + gig/job)
-- NOTE: we use existing "gigs" table with bigint id and owner uuid seen in your schema introspection.
create table if not exists public.agreements (
  id           uuid primary key default gen_random_uuid(),
  gig_id       bigint not null references public.gigs(id) on delete cascade,
  employer_id  uuid   not null,                   -- gigs.owner (typically)
  worker_id    uuid   not null,                   -- applicant
  status       text   not null check (status in ('pending','agreed','canceled','completed')),
  agreed_at    timestamptz,
  canceled_at  timestamptz,
  created_at   timestamptz not null default now(),
  unique (gig_id, worker_id)                      -- one agreement per worker per gig
);

create index if not exists agreements_worker_idx on public.agreements(worker_id, status);
create index if not exists agreements_employer_idx on public.agreements(employer_id, status);

-- 4) SETTINGS (grace window)
create table if not exists public.app_settings (
  key text primary key,
  value text not null
);
insert into public.app_settings(key, value)
  values ('tickets_refund_hours', '24')
on conflict (key) do nothing;

-- 5) SIGNUP BONUS (3 tickets) — safe UPSERT function and trigger
create or replace function public.grant_signup_bonus()
returns trigger language plpgsql as $$
begin
  -- give bonus only once (first time we see this user in profiles or users)
  if not exists (
    select 1 from public.tickets_ledger
    where user_id = NEW.id and reason = 'signup_bonus'
  ) then
    insert into public.tickets_ledger (user_id, delta, reason)
    values (NEW.id, 3, 'signup_bonus');
  end if;
  return NEW;
end $$;

-- Attach to profiles if present, otherwise to auth.users
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='profiles') then
    if not exists (select 1 from pg_trigger where tgname='tr_grant_signup_bonus_profiles') then
      create trigger tr_grant_signup_bonus_profiles
        after insert on public.profiles
        for each row execute procedure public.grant_signup_bonus();
    end if;
  else
    if not exists (select 1 from pg_trigger where tgname='tr_grant_signup_bonus_users') then
      create trigger tr_grant_signup_bonus_users
        after insert on auth.users
        for each row execute procedure public.grant_signup_bonus();
    end if;
  end if;
end $$;

-- 6) CHECK BALANCE helper
create or replace function public.require_tickets(u uuid, needed int)
returns boolean language sql stable as $$
  select coalesce((select balance from public.tickets_balances where user_id=u),0) >= needed
$$;

-- 7) DEDUCT ON AGREED (1 ticket from each)
create or replace function public.on_agreement_agreed()
returns trigger language plpgsql as $$
declare
  ok_emp boolean;
  ok_wrk boolean;
begin
  -- only when transitioning to agreed
  if NEW.status = 'agreed' and (OLD.status is distinct from 'agreed') then
    select public.require_tickets(NEW.employer_id, 1) into ok_emp;
    select public.require_tickets(NEW.worker_id, 1)   into ok_wrk;

    if not ok_emp or not ok_wrk then
      raise exception 'Insufficient tickets (employer ok=% worker ok=%)', ok_emp, ok_wrk
        using hint = 'Please buy tickets to proceed.';
    end if;

    insert into public.tickets_ledger(user_id, delta, reason, ref_type, ref_id)
    values
      (NEW.employer_id, -1, 'agree', 'agreement', NEW.id::text),
      (NEW.worker_id,   -1, 'agree', 'agreement', NEW.id::text);

    NEW.agreed_at := now();
  end if;
  return NEW;
end $$;

-- 8) REFUND ON CANCEL within grace window
create or replace function public.on_agreement_canceled()
returns trigger language plpgsql as $$
declare
  grace_hours int := (select value::int from public.app_settings where key='tickets_refund_hours');
begin
  if NEW.status = 'canceled' and (OLD.status is distinct from 'canceled') then
    NEW.canceled_at := now();
    if OLD.status = 'agreed' and OLD.agreed_at is not null then
      if now() - OLD.agreed_at <= make_interval(hours => grace_hours) then
        insert into public.tickets_ledger(user_id, delta, reason, ref_type, ref_id)
        values
          (NEW.employer_id, +1, 'refund', 'agreement', NEW.id::text),
          (NEW.worker_id,   +1, 'refund', 'agreement', NEW.id::text);
      end if;
    end if;
  end if;
  return NEW;
end $$;

-- 9) TRIGGERS
drop trigger if exists tr_agreement_agreed on public.agreements;
create trigger tr_agreement_agreed
  before update on public.agreements
  for each row execute procedure public.on_agreement_agreed();

drop trigger if exists tr_agreement_canceled on public.agreements;
create trigger tr_agreement_canceled
  before update on public.agreements
  for each row execute procedure public.on_agreement_canceled();

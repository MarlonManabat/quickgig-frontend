-- QuickGig.ph – Revised symmetric ticket model (idempotent, non-destructive)

create extension if not exists pgcrypto;

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user',
  tickets int not null default 3,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- migrate legacy post_credits -> tickets (best-effort)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='profiles' and column_name='post_credits'
  ) then
    update public.profiles
      set tickets = coalesce(tickets, 0) + greatest(coalesce(post_credits,0),0)
    where true;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where policyname='profiles: read own' and tablename='profiles') then
    create policy "profiles: read own" on public.profiles for select using (auth.uid()=id);
  end if;
  if not exists (select 1 from pg_policies where policyname='profiles: update own' and tablename='profiles') then
    create policy "profiles: update own" on public.profiles for update using (auth.uid()=id);
  end if;
end $$;

-- signup bonus
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, tickets) values (new.id, 3)
  on conflict (id) do nothing;
  return new;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where t.tgname='on_auth_user_created' and n.nspname='auth'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end $$;

-- GIGS
do $$
begin
  if to_regclass('public.gigs') is null then
    create table public.gigs (
      id uuid primary key default gen_random_uuid(),
      employer_id uuid not null references auth.users(id),
      title text not null,
      description text not null,
      region_code text not null,
      city_code text not null,
      budget numeric(12,2),
      created_at timestamptz not null default now()
    );
  end if;
  -- add columns if missing (idempotent hardening)
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='gigs' and column_name='employer_id') then
    alter table public.gigs add column employer_id uuid;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='gigs' and column_name='region_code') then
    alter table public.gigs add column region_code text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='gigs' and column_name='city_code') then
    alter table public.gigs add column city_code text;
  end if;
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='gigs' and column_name='budget') then
    alter table public.gigs add column budget numeric(12,2);
  end if;
end $$;

alter table public.gigs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gigs' and policyname='gigs: insert requires ticket') then
    create policy "gigs: insert requires ticket"
    on public.gigs for insert
    with check (
      auth.uid() = employer_id and
      exists(select 1 from public.profiles p where p.id = auth.uid() and p.tickets > 0)
    );
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gigs' and policyname='gigs: read all') then
    create policy "gigs: read all" on public.gigs for select using (true);
  end if;
end $$;

create index if not exists gigs_region_city_idx on public.gigs(region_code, city_code);
create index if not exists gigs_created_idx     on public.gigs(created_at desc);

-- AGREEMENTS
create table if not exists public.agreements (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete cascade,
  employer_id uuid not null references auth.users(id),
  worker_id uuid not null references auth.users(id),
  status text not null default 'proposed' check (status in ('proposed','accepted','rejected','cancelled','completed')),
  notes text,
  created_at timestamptz not null default now(),
  agreed_at timestamptz
);
alter table public.agreements enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename='agreements' and policyname='agreements: read own') then
    create policy "agreements: read own" on public.agreements
      for select using (auth.uid() in (employer_id, worker_id));
  end if;
  if not exists (select 1 from pg_policies where tablename='agreements' and policyname='agreements: insert require ticket') then
    create policy "agreements: insert require ticket" on public.agreements
      for insert
      with check (
        (auth.uid() = employer_id or auth.uid() = worker_id) and
        exists(select 1 from public.profiles p where p.id = auth.uid() and p.tickets > 0)
      );
  end if;
end $$;

-- TICKET LEDGER
create table if not exists public.ticket_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  delta int not null,
  reason text not null,  -- signup_bonus | topup_approved | agreement_employer | agreement_worker | admin_adjust
  ref_type text,         -- agreement | order | misc
  ref_id uuid,
  created_at timestamptz not null default now()
);
alter table public.ticket_ledger enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename='ticket_ledger' and policyname='ticket_ledger: read own') then
    create policy "ticket_ledger: read own" on public.ticket_ledger
      for select using (auth.uid()=user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='ticket_ledger' and policyname='ticket_ledger: admin read all') then
    create policy "ticket_ledger: admin read all" on public.ticket_ledger
      for select using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
  end if;
end $$;

create index if not exists ticket_ledger_user_idx on public.ticket_ledger(user_id, created_at desc);

-- STORAGE bucket for payment proofs
do $$
begin
  perform storage.create_bucket('payments', false, false);
exception when others then
  if sqlstate <> '23505' then raise notice 'create_bucket failed: %', sqlerrm; end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='payments: user insert own proofs') then
    create policy "payments: user insert own proofs" on storage.objects
      for insert to authenticated
      with check (bucket_id='payments' and name like ('proofs/'||auth.uid()::text||'/%'));
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='payments: user read own proofs') then
    create policy "payments: user read own proofs" on storage.objects
      for select to authenticated
      using (bucket_id='payments' and name like ('proofs/'||auth.uid()::text||'/%'));
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='payments: admin read all') then
    create policy "payments: admin read all" on storage.objects
      for select to authenticated
      using (bucket_id='payments' and exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
  end if;
end $$;

-- RPCs
create or replace function public.create_gig_if_allowed(
  p_title text, p_description text, p_region_code text, p_city_code text, p_budget numeric
) returns uuid
language plpgsql security definer
set search_path = public, auth
as $$
declare v_uid uuid := auth.uid(); v_id uuid;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if (select tickets from public.profiles where id=v_uid) < 1 then
    raise exception 'NEED_TICKET_TO_PARTICIPATE';
  end if;
  insert into public.gigs (employer_id,title,description,region_code,city_code,budget)
  values (v_uid,p_title,p_description,p_region_code,p_city_code,p_budget)
  returning id into v_id;
  return v_id;
end $$;
grant execute on function public.create_gig_if_allowed(text,text,text,text,numeric) to authenticated;

-- Back-compat wrapper (no spend)
create or replace function public.decrement_credit_and_create_gig(
  p_title text, p_description text, p_region_code text, p_city_code text, p_budget numeric
) returns uuid
language plpgsql security definer
set search_path = public, auth
as $$
begin
  return public.create_gig_if_allowed(p_title,p_description,p_region_code,p_city_code,p_budget);
end $$;
grant execute on function public.decrement_credit_and_create_gig(text,text,text,text,numeric) to authenticated;

-- Spend tickets when agreement is accepted (both sides, atomic)
create or replace function public.finalize_agreement(p_agreement_id uuid) returns void
language plpgsql security definer
set search_path = public, auth
as $$
declare v_emp uuid; v_worker uuid; v_status text;
begin
  select employer_id, worker_id, status
  into v_emp, v_worker, v_status
  from public.agreements
  where id=p_agreement_id
  for update;

  if not found then raise exception 'AGREEMENT_NOT_FOUND'; end if;
  if v_status <> 'proposed' then raise exception 'INVALID_STATUS'; end if;

  if coalesce((select tickets from public.profiles where id=v_emp),0) < 1 then
    raise exception 'EMPLOYER_NO_TICKET';
  end if;
  if coalesce((select tickets from public.profiles where id=v_worker),0) < 1 then
    raise exception 'WORKER_NO_TICKET';
  end if;

  update public.profiles set tickets = tickets - 1 where id=v_emp;
  insert into public.ticket_ledger(user_id, delta, reason, ref_type, ref_id)
    values (v_emp, -1, 'agreement_employer','agreement', p_agreement_id);

  update public.profiles set tickets = tickets - 1 where id=v_worker;
  insert into public.ticket_ledger(user_id, delta, reason, ref_type, ref_id)
    values (v_worker, -1, 'agreement_worker','agreement', p_agreement_id);

  update public.agreements set status='accepted', agreed_at=now() where id=p_agreement_id;
end $$;
grant execute on function public.finalize_agreement(uuid) to authenticated;

-- Orders (top-up == tickets)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  amount numeric(12,2) not null,
  credits int not null default 3,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  proof_path text,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  notes text,
  payment_method text not null default 'gcash',
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename='orders' and policyname='orders: read own') then
    create policy "orders: read own" on public.orders for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='orders' and policyname='orders: create own pending') then
    create policy "orders: create own pending" on public.orders for insert
      with check (auth.uid() = user_id and status='pending');
  end if;
  if not exists (select 1 from pg_policies where tablename='orders' and policyname='orders: admins manage') then
    create policy "orders: admins manage" on public.orders for all
      using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
  end if;
end $$;

create or replace function public.admin_approve_order(p_order_id uuid) returns void
language plpgsql security definer
set search_path = public, auth
as $$
declare v_uid uuid := auth.uid(); v_is_admin boolean; v_user uuid; v_credits int;
begin
  select exists (select 1 from public.profiles p where p.id=v_uid and p.role='admin') into v_is_admin;
  if not v_is_admin then raise exception 'ADMIN_ONLY'; end if;

  select user_id, credits into v_user, v_credits
  from public.orders where id=p_order_id and status='pending' for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;

  update public.orders set status='approved', approved_by=v_uid, approved_at=now() where id=p_order_id;
  update public.profiles set tickets = tickets + v_credits where id=v_user;

  insert into public.ticket_ledger(user_id, delta, reason, ref_type, ref_id)
    values (v_user, v_credits, 'topup_approved','order', p_order_id);
end $$;
grant execute on function public.admin_approve_order(uuid) to authenticated;

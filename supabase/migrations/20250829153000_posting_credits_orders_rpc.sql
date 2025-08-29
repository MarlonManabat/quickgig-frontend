-- PROFILES (idempotent)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user',
  post_credits int not null default 3,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- RLS for profiles
do $$
begin
  if not exists (select 1 from pg_policies where policyname='profiles: read own' and tablename='profiles') then
    create policy "profiles: read own" on public.profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname='profiles: update own' and tablename='profiles') then
    create policy "profiles: update own" on public.profiles for update using (auth.uid() = id);
  end if;
end $$;

-- Trigger to auto-create profile on signup (idempotent)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- GIGS (idempotent)
create table if not exists public.gigs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references auth.users(id),
  title text not null,
  description text not null,
  region_code text not null,
  city_code text not null,
  budget numeric(12,2),
  created_at timestamptz not null default now()
);
alter table public.gigs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname='gigs: insert own' and tablename='gigs') then
    create policy "gigs: insert own" on public.gigs for insert with check (auth.uid() = employer_id);
  end if;
  if not exists (select 1 from pg_policies where policyname='gigs: read all' and tablename='gigs') then
    create policy "gigs: read all" on public.gigs for select using (true);
  end if;
end $$;

create index if not exists gigs_region_city_idx on public.gigs (region_code, city_code);

-- ORDERS (manual top-up via GCash)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  amount numeric(12,2) not null,
  credits int not null default 3,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  proof_path text,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname='orders: read own' and tablename='orders') then
    create policy "orders: read own" on public.orders for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname='orders: create own pending' and tablename='orders') then
    create policy "orders: create own pending" on public.orders for insert
    with check (auth.uid() = user_id and status = 'pending');
  end if;
  if not exists (select 1 from pg_policies where policyname='orders: admins manage' and tablename='orders') then
    create policy "orders: admins manage" on public.orders for all
    using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
  end if;
end $$;

-- STORAGE bucket for proofs (private)
do $$
begin
  perform storage.create_bucket('payments', false, false);
exception when others then
  if sqlstate <> '23505' then
    raise notice 'create_bucket failed: %', sqlerrm;
  end if;
end $$;

create policy if not exists "payments: user insert own proofs" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'payments' and name like ('proofs/' || auth.uid()::text || '/%'));

create policy if not exists "payments: user read own proofs" on storage.objects
  for select to authenticated
  using (bucket_id = 'payments' and name like ('proofs/' || auth.uid()::text || '/%'));

create policy if not exists "payments: admin read all" on storage.objects
  for select to authenticated
  using (bucket_id = 'payments' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Atomic RPC: decrement credit & create gig
create or replace function public.decrement_credit_and_create_gig(
  p_title text,
  p_description text,
  p_region_code text,
  p_city_code text,
  p_budget numeric
) returns uuid
language plpgsql security definer as $$
declare
  v_uid uuid := auth.uid();
  v_gig uuid;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;

  update public.profiles set post_credits = post_credits - 1
    where id = v_uid and post_credits > 0;
  if not found then raise exception 'NO_CREDITS'; end if;

  insert into public.gigs (employer_id, title, description, region_code, city_code, budget)
  values (v_uid, p_title, p_description, p_region_code, p_city_code, p_budget)
  returning id into v_gig;

  return v_gig;
end $$;

grant execute on function public.decrement_credit_and_create_gig(text,text,text,text,numeric) to authenticated;

-- Admin RPC: approve order and grant credits
create or replace function public.admin_approve_order(p_order_id uuid) returns void
language plpgsql security definer as $$
declare
  v_uid uuid := auth.uid();
  v_is_admin boolean;
  v_user uuid;
  v_credits int;
begin
  select exists (select 1 from public.profiles p where p.id = v_uid and p.role = 'admin') into v_is_admin;
  if not v_is_admin then raise exception 'ADMIN_ONLY'; end if;

  select user_id, credits into v_user, v_credits from public.orders
  where id = p_order_id and status='pending' for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;

  update public.orders set status='approved', approved_by=v_uid, approved_at=now()
  where id = p_order_id;

  update public.profiles set post_credits = post_credits + v_credits where id = v_user;
end $$;

grant execute on function public.admin_approve_order(uuid) to authenticated;


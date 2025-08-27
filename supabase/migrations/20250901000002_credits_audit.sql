-- user_credits table
create table if not exists public.user_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  credits int not null default 3,
  updated_at timestamptz not null default now()
);

-- auto-init credits on signup
create or replace function public.init_user_credits() returns trigger
language plpgsql as $$
begin
  insert into public.user_credits(user_id, credits)
  values (new.id, 3)
  on conflict (user_id) do nothing;
  return new;
end $$;
drop trigger if exists trg_init_user_credits on auth.users;
create trigger trg_init_user_credits
after insert on auth.users
for each row execute procedure public.init_user_credits();

-- RLS
alter table public.user_credits enable row level security;
create policy "read own credits"
  on public.user_credits for select
  using (auth.uid() = user_id);

-- secure RPC to decrement 1 credit for the caller
create or replace function public.decrement_credit()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare new_credits int;
begin
  update public.user_credits
    set credits = credits - 1,
        updated_at = now()
  where user_id = auth.uid() and credits > 0
  returning credits into new_credits;
  if new_credits is null then
    raise exception 'no_credits';
  end if;
  return new_credits;
end $$;

-- admin grant RPC
create or replace function public.grant_credits(p_user uuid, p_delta int)
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare out_credits int;
begin
  if not exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ) then
    raise exception 'forbidden';
  end if;
  insert into public.user_credits(user_id, credits)
    values (p_user, greatest(p_delta,0))
  on conflict (user_id) do update
    set credits = public.user_credits.credits + greatest(p_delta,0),
        updated_at = now()
  returning credits into out_credits;
  return out_credits;
end $$;

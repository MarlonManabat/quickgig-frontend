create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_profiles_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.touch_profiles_updated_at();

create or replace function public.secure_upsert_profile(uid uuid, full_name text, avatar_url text)
returns void language plpgsql security definer set search_path=public as $$
begin
  if uid <> auth.uid() then raise exception 'uid mismatch'; end if;
  insert into public.profiles (id,email,full_name,avatar_url)
  values (uid,(select email from auth.users where id=uid),nullif(full_name,''),avatar_url)
  on conflict(id) do update
    set full_name=excluded.full_name,
        avatar_url=excluded.avatar_url,
        email=coalesce(public.profiles.email, excluded.email);
end $$;

alter table public.profiles enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
for select using ( id = auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin) );

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
for update using ( id = auth.uid() ) with check ( id = auth.uid() );

drop policy if exists "profiles_admin_read_all" on public.profiles;
create policy "profiles_admin_read_all" on public.profiles
for select using ( exists (select 1 from public.profiles p where p.id=auth.uid() and p.is_admin) );

revoke insert on public.profiles from anon, authenticated;
comment on function public.secure_upsert_profile is 'Upsert own profile; enforces uid = auth.uid()';

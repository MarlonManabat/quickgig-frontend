alter table public.profiles
  add column if not exists role_pref text
  check (role_pref in ('worker','employer'));

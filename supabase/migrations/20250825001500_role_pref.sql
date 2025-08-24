-- Add the column if it doesn't exist
alter table public.profiles
  add column if not exists role_pref text;

-- Add a check constraint only if missing
do $$
begin
  if not exists (
    select 1
    from   pg_constraint
    where  conname = 'profiles_role_pref_check'
           and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_pref_check
      check (role_pref is null or role_pref in ('worker','employer'));
  end if;
end $$;

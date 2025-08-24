-- 1) Add email column if missing
alter table public.profiles
  add column if not exists email text;

-- 2) Backfill from auth.users (one-time)
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and p.email is null;

-- 3) Helpful index for lookups
create index if not exists profiles_email_lower_idx
  on public.profiles (lower(email));

-- 4) Sync function: keep profiles.email in sync with auth.users.email
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Insert: if profile exists, update; if not, do nothing (your app may have its own profile bootstrap)
  if (tg_op = 'INSERT') then
    update public.profiles
      set email = NEW.email
      where id = NEW.id
        and (email is distinct from NEW.email);
    return NEW;
  end if;

  -- Update: only when email actually changed
  if (tg_op = 'UPDATE') and (NEW.email is distinct from OLD.email) then
    update public.profiles
      set email = NEW.email
      where id = NEW.id
        and (email is distinct from NEW.email);
    return NEW;
  end if;

  return NEW;
end;
$$;

-- 5) Triggers on auth.users (insert + email update)
drop trigger if exists trg_sync_profile_email_ins on auth.users;
create trigger trg_sync_profile_email_ins
after insert on auth.users
for each row execute function public.sync_profile_email();

drop trigger if exists trg_sync_profile_email_upd on auth.users;
create trigger trg_sync_profile_email_upd
after update of email on auth.users
for each row execute function public.sync_profile_email();

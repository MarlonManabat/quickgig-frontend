-- Add gigs.published and keep it in sync with status
begin;

-- 1) Add column if missing
alter table public.gigs
  add column if not exists published boolean;

-- 2) Backfill once: published = (status = 'published')
update public.gigs
set published = (status = 'published')
where published is null;

-- 3) Create sync trigger fn (updates whichever is stale)
create or replace function public.gigs_status_published_sync()
returns trigger
language plpgsql
as $$
begin
  -- If status changed, derive published
  if tg_op in ('INSERT','UPDATE') and (NEW.status is distinct from OLD.status) then
    NEW.published := (NEW.status = 'published');
    return NEW;
  end if;

  -- If published changed (and status didn't), derive status
  if tg_op = 'UPDATE' and (NEW.published is distinct from OLD.published)
     and (NEW.status is not distinct from OLD.status) then
    NEW.status := case when NEW.published then 'published' else 'draft' end;
    return NEW;
  end if;

  -- On INSERT where both are provided or unchanged, ensure consistency
  if tg_op = 'INSERT' then
    if NEW.published is null then
      NEW.published := (NEW.status = 'published');
    elsif NEW.status is null then
      NEW.status := case when NEW.published then 'published' else 'draft' end;
    end if;
  end if;

  return NEW;
end
$$;

drop trigger if exists tr_gigs_status_published_sync on public.gigs;
create trigger tr_gigs_status_published_sync
before insert or update on public.gigs
for each row execute function public.gigs_status_published_sync();

commit;

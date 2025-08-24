-- Rename is_remote → is_online, or add if not present
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='jobs' and column_name='is_remote'
  ) then
    alter table public.jobs rename column is_remote to is_online;
  else
    alter table public.jobs add column if not exists is_online boolean not null default false;
  end if;
end $$;

-- Ensure structured location fields exist
alter table public.jobs
  add column if not exists location_region text,
  add column if not exists location_city text,
  add column if not exists location_address text;

-- Indexes
create index if not exists jobs_city_lower_idx on public.jobs (lower(location_city));
create index if not exists jobs_region_lower_idx on public.jobs (lower(location_region));
create index if not exists jobs_online_idx on public.jobs (is_online);

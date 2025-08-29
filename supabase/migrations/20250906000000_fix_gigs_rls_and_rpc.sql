-- Enable RLS (no-op if already enabled)
alter table public.gigs enable row level security;

-- Drop a known legacy policy if it exists (referenced old employer_id column).
do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='gigs' and policyname='gigs: insert own (legacy)'
  ) then
    execute 'drop policy "gigs: insert own (legacy)" on public.gigs';
  end if;
end$$;

-- Upsert correct RLS policies based on created_by
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='gigs' and policyname='gigs: insert own'
  ) then
    execute $p$
      create policy "gigs: insert own"
      on public.gigs
      for insert
      to authenticated
      with check (created_by = auth.uid());
    $p$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='gigs' and policyname='gigs: read own'
  ) then
    execute $p$
      create policy "gigs: read own"
      on public.gigs
      for select
      to authenticated
      using (created_by = auth.uid());
    $p$;
  end if;
end$$;

-- Helpful default (safe if already set)
alter table public.gigs
  alter column created_at set default now();

-- Create a safe RPC to insert gigs without ticket consumption.
create or replace function public.create_gig_public(
  p_title        text,
  p_description  text,
  p_region_code  text,
  p_city_code    text,
  p_price_php    numeric
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_id   uuid;
begin
  if v_user is null then
    raise exception 'not_authenticated' using errcode='P0001';
  end if;

  insert into public.gigs (title, description, region_code, city_code, price_php, created_by)
  values (p_title, p_description, p_region_code, p_city_code, p_price_php, v_user)
  returning id into v_id;

  return v_id;

exception
  when foreign_key_violation then
    raise exception 'invalid_location' using errcode='P0001';
  when not_null_violation then
    raise exception 'missing_required_field' using errcode='P0001';
  when others then
    raise exception 'create_failed: %', SQLERRM using errcode='P0001';
end $$;

grant execute on function public.create_gig_public(text, text, text, text, numeric)
to authenticated;

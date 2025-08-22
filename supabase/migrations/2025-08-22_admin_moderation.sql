-- Profiles: moderation flags
alter table if exists public.profiles
  add column if not exists hidden boolean default false,
  add column if not exists blocked boolean default false;

-- Gigs: moderation flag
alter table if exists public.gigs
  add column if not exists hidden boolean default false;

-- Reports table
create table if not exists public.reports (
  id bigserial primary key,
  kind text not null check (kind in ('gig','profile','message')),
  target_id text not null,
  reason text,
  reporter uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

do $$ begin
  create policy if not exists "reports_insert_any_auth"
  on public.reports for insert to authenticated
  with check (true);
exception when duplicate_object then null; end $$;

-- Prevent applying to hidden gigs (apps table already exists)
-- Add an extra WITH CHECK policy so hidden gigs cannot receive new applications.
do $$ begin
  create policy if not exists "apps_insert_disallow_hidden_gig"
  on public.applications for insert to authenticated
  with check (
    exists (
      select 1 from public.gigs g
      where g.id = public.applications.gig_id
        and coalesce(g.hidden, false) = false
    )
  );
exception when duplicate_object then null; end $$;

-- (Optional) Make sure notifications enum has a value for moderation events
do $$ begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace
                 where t.typname='notification_type' and n.nspname='public') then
    create type public.notification_type as enum ('message','offer','hired','saved_gig_activity','alert_match');
  end if;
  alter type public.notification_type add value if not exists 'content_hidden';
end $$;

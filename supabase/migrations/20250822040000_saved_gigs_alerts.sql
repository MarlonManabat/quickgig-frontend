-- Saved gigs
create table if not exists public.saved_gigs (
  user_id uuid not null references auth.users(id) on delete cascade,
  gig_id  bigint not null references public.gigs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, gig_id)
);
alter table public.saved_gigs enable row level security;

-- RLS
create policy if not exists "owner can manage their saved list"
on public.saved_gigs for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Simple alerts (keyword + city)
create table if not exists public.gig_alerts (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  keyword text,              -- e.g., "plumber"
  city text,                 -- nullable
  created_at timestamptz not null default now(),
  last_notified_at timestamptz
);
alter table public.gig_alerts enable row level security;

create policy if not exists "owner manages their alerts"
on public.gig_alerts for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Reuse notifications for pings
-- on new application → notify owners who saved that gig (kind: 'saved_gig_activity')
create type if not exists public.notification_type as enum ('message','offer','hired','saved_gig_activity','alert_match');

create or replace function public.notify_saved_gig_activity()
returns trigger language plpgsql security definer as $$
begin
  insert into public.notifications (user_id, app_id, kind, payload)
  select sg.user_id, NEW.app_id, 'saved_gig_activity',
         jsonb_build_object('gig_id', a.gig_id, 'event', 'new_application')
  from public.applications a
  join public.saved_gigs sg on sg.gig_id = a.gig_id
  where a.id = NEW.app_id;
  return NEW;
end$$;

drop trigger if exists trg_notify_saved_gig_activity on public.applications;
create trigger trg_notify_saved_gig_activity
after insert on public.applications
for each row execute function public.notify_saved_gig_activity();

-- Enable realtime on saved tables
alter publication supabase_realtime add table public.saved_gigs;
alter publication supabase_realtime add table public.gig_alerts;

-- THREADS: messages are per application
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  application_id bigint not null references public.applications(id) on delete cascade,
  sender uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(body) <= 5000),
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;

-- Only participants (app owner or worker) can SELECT messages for that application
create policy if not exists "messages_select_participants"
on public.messages for select
using (
  exists (
    select 1 from public.applications a
    where a.id = messages.application_id
      and (a.owner = auth.uid() or a.worker = auth.uid())
  )
);

-- Only participants can INSERT; sender must be current user
create policy if not exists "messages_insert_participants"
on public.messages for insert
with check (
  sender = auth.uid()
  and exists (
    select 1 from public.applications a
    where a.id = application_id
      and (a.owner = auth.uid() or a.worker = auth.uid())
  )
);

-- OFFERS: created by owner; worker can accept/decline
do $$ begin
  if not exists (select 1 from pg_type where typname = 'offer_status') then
    create type public.offer_status as enum ('pending','accepted','declined','withdrawn');
  end if;
end $$;

create table if not exists public.offers (
  id bigint generated always as identity primary key,
  application_id bigint not null references public.applications(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  amount numeric(12,2) null check (amount >= 0),
  notes text null check (length(notes) <= 5000),
  status public.offer_status not null default 'pending',
  created_at timestamptz not null default now(),
  decided_at timestamptz null
);
alter table public.offers enable row level security;

-- Participants can read
create policy if not exists "offers_select_participants"
on public.offers for select
using (
  exists (
    select 1 from public.applications a
    where a.id = offers.application_id
      and (a.owner = auth.uid() or a.worker = auth.uid())
  )
);

-- Only OWNER can create an offer on their application
create policy if not exists "offers_insert_owner"
on public.offers for insert
with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.applications a
    where a.id = application_id
      and a.owner = auth.uid()
  )
);

-- Only WORKER can accept/decline; enforce status transitions
create policy if not exists "offers_update_worker_decide"
on public.offers for update
using (
  exists (
    select 1 from public.applications a
    where a.id = offers.application_id
      and a.worker = auth.uid()
  )
  and offers.status = 'pending'
)
with check (
  status in ('accepted','declined')
  and decided_at is not null
);

-- APPLICATION status quality of life (optional)
do $$ begin
  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type public.application_status as enum ('applied','offered','hired','rejected','withdrawn','completed');
  end if;
end $$;

alter table public.applications
  add column if not exists status public.application_status not null default 'applied',
  add column if not exists updated_at timestamptz not null default now();

-- Auto-bump updated_at
create or replace trigger applications_touch_updated
before update on public.applications
for each row execute function extensions.moddatetime (updated_at);

-- When an offer is accepted, mark application as 'hired'
create or replace function public.promote_application_to_hired()
returns trigger language plpgsql as $$
begin
  update public.applications
    set status = 'hired', updated_at = now()
  where id = new.application_id
    and new.status = 'accepted';
  return new;
end $$;

drop trigger if exists offers_on_accept_promote on public.offers;
create trigger offers_on_accept_promote
after update on public.offers
for each row when (new.status = 'accepted' and old.status = 'pending')
execute function public.promote_application_to_hired();

-- Notifications table
create type if not exists public.notification_type as enum ('message','offer','hired');

create table if not exists public.notifications (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,  -- recipient
  app_id      uuid references public.applications(id) on delete cascade,
  kind        public.notification_type not null,
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  seen_at     timestamptz
);

alter table public.notifications enable row level security;

-- RLS: recipient can read/update their notifications
create policy if not exists "recipient can read"
on public.notifications for select to authenticated
using (user_id = auth.uid());

create policy if not exists "recipient can update"
on public.notifications for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Insert is performed by triggers/functions only
revoke insert on public.notifications from authenticated;

-- Helper: recipient of an application (the other participant)
create or replace function public.other_participant(_app uuid, _actor uuid)
returns uuid language sql stable as $$
  select case
           when a.owner = _actor then a.worker
           when a.worker = _actor then a.owner
           else null
         end
  from public.applications a
  where a.id = _app
$$;

-- Trigger: notify on new message
create or replace function public.notify_on_message()
returns trigger language plpgsql security definer as $$
declare
  recipient uuid;
begin
  recipient := public.other_participant(NEW.application_id, NEW.sender);
  if recipient is not null then
    insert into public.notifications (user_id, app_id, kind, payload)
    values (recipient, NEW.application_id, 'message',
            jsonb_build_object('snippet', left(coalesce(NEW.body, ''), 140)));
  end if;
  return NEW;
end$$;

drop trigger if exists trg_notify_on_message on public.messages;
create trigger trg_notify_on_message
after insert on public.messages
for each row execute function public.notify_on_message();

-- Trigger: notify on new offer or hired status
create or replace function public.notify_on_offer_or_hired()
returns trigger language plpgsql security definer as $$
declare
  recipient uuid;
  k public.notification_type;
begin
  if TG_TABLE_NAME = 'offers' then
    recipient := public.other_participant(NEW.application_id, NEW.created_by);
    k := 'offer';
  else
    -- applications status updated to hired
    if NEW.status is distinct from OLD.status and NEW.status = 'hired' then
      -- both parties get a ping
      insert into public.notifications (user_id, app_id, kind, payload)
      values (NEW.owner, NEW.id, 'hired', jsonb_build_object()),
             (NEW.worker, NEW.id, 'hired', jsonb_build_object());
    end if;
    return NEW;
  end if;

  if recipient is not null then
    insert into public.notifications (user_id, app_id, kind, payload)
    values (recipient, NEW.application_id, k, jsonb_build_object());
  end if;
  return NEW;
end$$;

-- Offers trigger
drop trigger if exists trg_notify_on_offer on public.offers;
create trigger trg_notify_on_offer
after insert on public.offers
for each row execute function public.notify_on_offer_or_hired();

-- Applications "hired" trigger
drop trigger if exists trg_notify_on_hired on public.applications;
create trigger trg_notify_on_hired
after update on public.applications
for each row execute function public.notify_on_offer_or_hired();

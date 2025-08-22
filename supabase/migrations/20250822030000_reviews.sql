-- Denormalized fields on profiles (optional but useful)
alter table if exists public.profiles
  add column if not exists rating_avg numeric,
  add column if not exists rating_count integer;

-- Reviews: one per reviewer→subject per application
create table if not exists public.reviews (
  id bigserial primary key,
  app_id bigint not null references public.applications(id) on delete cascade,
  reviewer uuid not null references auth.users(id) on delete cascade,
  reviewee uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (app_id, reviewer, reviewee)
);
alter table public.reviews enable row level security;

-- RLS: reviewer can insert their own review; both sides can read reviews about themselves or their counterpart
create policy if not exists "insert by reviewer"
on public.reviews for insert to authenticated
with check (auth.uid() = reviewer);

create policy if not exists "read own or counterpart"
on public.reviews for select to authenticated
using (auth.uid() in (reviewer, reviewee));

-- Only allow reviews for hired applications where reviewer/reviewee are owner/worker of that app
create or replace function public.enforce_review_participants()
returns trigger language plpgsql security definer as $$
declare r record;
begin
  select a.status, g.owner, a.worker into r
  from public.applications a
  join public.gigs g on g.id = a.gig_id
  where a.id = NEW.app_id;

  if r.status not in ('hired','completed') then
    raise exception 'Cannot review unless application is hired/completed';
  end if;

  if not ((NEW.reviewer = r.owner and NEW.reviewee = r.worker)
       or (NEW.reviewer = r.worker and NEW.reviewee = r.owner)) then
    raise exception 'Reviewer/reviewee must be the app owner/worker';
  end if;

  return NEW;
end$$;

drop trigger if exists trg_enforce_review_participants on public.reviews;
create trigger trg_enforce_review_participants
before insert on public.reviews
for each row execute function public.enforce_review_participants();

-- Update profile aggregates after insert
create or replace function public.bump_profile_rating()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles p set
    rating_count = coalesce(rating_count,0) + 1,
    rating_avg   = round(((coalesce(rating_avg,0)*coalesce(rating_count,0)) + NEW.rating)::numeric
                         / (coalesce(rating_count,0)+1), 2)
  where p.id = NEW.reviewee;
  return NEW;
end$$;

drop trigger if exists trg_bump_profile_rating on public.reviews;
create trigger trg_bump_profile_rating
after insert on public.reviews
for each row execute function public.bump_profile_rating();

-- Notify reviewee
alter type public.notification_type add value if not exists 'review_received';
create or replace function public.notify_reviewee()
returns trigger language plpgsql security definer as $$
begin
  insert into public.notifications (user_id, kind, payload)
  values (NEW.reviewee, 'review_received',
          jsonb_build_object('app_id', NEW.app_id, 'rating', NEW.rating));
  return NEW;
end$$;

drop trigger if exists trg_notify_reviewee on public.reviews;
create trigger trg_notify_reviewee
after insert on public.reviews
for each row execute function public.notify_reviewee();

-- Realtime
alter publication supabase_realtime add table public.reviews;

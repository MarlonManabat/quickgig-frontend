-- Supabase Audit & Fix (Idempotent)
-- Safe to run multiple times

-- ========== Extensions ==========
create extension if not exists pgcrypto;

-- ========== Helpers ==========
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ========== Enums ==========
create type if not exists application_status as enum ('applied','offered','hired','rejected');
create type if not exists order_status       as enum ('pending','submitted','paid','rejected','expired');

-- ========== profiles ==========
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='self_rw') then
    create policy self_rw on public.profiles
      for all using (auth.uid() = id) with check (auth.uid() = id);
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_trigger where tgname='_profiles_set_updated_at') then
    create trigger _profiles_set_updated_at before update on public.profiles
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- ========== admins (optional allowlist) ==========
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='admins' and policyname='admins_self') then
    create policy admins_self on public.admins for select using (auth.uid() = user_id);
  end if;
end $$;

-- ========== gigs ==========
create table if not exists public.gigs (
  id          bigserial primary key,
  owner       uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  description text,
  budget      numeric,
  city        text,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.gigs enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gigs' and policyname='gigs_public_read') then
    create policy gigs_public_read on public.gigs for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='gigs' and policyname='gigs_owner_cud') then
    create policy gigs_owner_cud on public.gigs for all
      using (auth.uid() = owner) with check (auth.uid() = owner);
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_trigger where tgname='_gigs_set_updated_at') then
    create trigger _gigs_set_updated_at before update on public.gigs
      for each row execute function public.set_updated_at();
  end if;
end $$;
create index if not exists gigs_owner_idx on public.gigs(owner, created_at desc);

-- ========== applications ==========
create table if not exists public.applications (
  id          bigserial primary key,
  gig_id      bigint not null references public.gigs(id) on delete cascade,
  applicant   uuid   not null references auth.users(id) on delete cascade,
  status      application_status not null default 'applied',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(gig_id, applicant)
);
alter table public.applications enable row level security;
do $$ begin
  -- read if participant (applicant) or gig owner
  if not exists (select 1 from pg_policies where policyname='apps_read_participants' and tablename='applications') then
    create policy apps_read_participants on public.applications for select
    using (
      applicant = auth.uid()
      or exists (select 1 from public.gigs g where g.id = applications.gig_id and g.owner = auth.uid())
    );
  end if;
  -- apply (insert) by applicant only
  if not exists (select 1 from pg_policies where policyname='apps_insert_applicant' and tablename='applications') then
    create policy apps_insert_applicant on public.applications for insert
    with check (applicant = auth.uid());
  end if;
  -- update by applicant (limited client-side) or gig owner (offer/hire/reject)
  if not exists (select 1 from pg_policies where policyname='apps_update_participants' and tablename='applications') then
    create policy apps_update_participants on public.applications for update
    using (
      applicant = auth.uid()
      or exists (select 1 from public.gigs g where g.id = applications.gig_id and g.owner = auth.uid())
    )
    with check (
      applicant = auth.uid()
      or exists (select 1 from public.gigs g where g.id = applications.gig_id and g.owner = auth.uid())
    );
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_trigger where tgname='_apps_set_updated_at') then
    create trigger _apps_set_updated_at before update on public.applications
      for each row execute function public.set_updated_at();
  end if;
end $$;
create index if not exists apps_gig_idx on public.applications(gig_id, created_at desc);
create index if not exists apps_applicant_idx on public.applications(applicant, created_at desc);

-- ========== messages (per application thread) ==========
create table if not exists public.messages (
  id             bigserial primary key,
  application_id bigint not null references public.applications(id) on delete cascade,
  sender_id      uuid   not null references auth.users(id) on delete cascade,
  body           text   not null,
  created_at     timestamptz not null default now()
);
alter table public.messages enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname='msgs_participants_rw' and tablename='messages') then
    create policy msgs_participants_rw on public.messages for all
    using (
      exists (
        select 1
        from public.applications a
        join public.gigs g on g.id = a.gig_id
        where a.id = messages.application_id
          and (a.applicant = auth.uid() or g.owner = auth.uid())
      )
    )
    with check (sender_id = auth.uid());
  end if;
end $$;
create index if not exists msgs_app_idx on public.messages(application_id, created_at desc);

-- ========== message_reads ==========
create table if not exists public.message_reads (
  application_id bigint not null references public.applications(id) on delete cascade,
  user_id        uuid   not null references auth.users(id) on delete cascade,
  last_read_at   timestamptz not null default now(),
  primary key (application_id, user_id)
);
alter table public.message_reads enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname='reads_participants_upsert' and tablename='message_reads') then
    create policy reads_participants_upsert on public.message_reads for all
    using (
      exists (
        select 1
        from public.applications a
        join public.gigs g on g.id = a.gig_id
        where a.id = message_reads.application_id
          and (a.applicant = auth.uid() or g.owner = auth.uid())
      )
    )
    with check (user_id = auth.uid());
  end if;
end $$;

-- ========== notifications ==========
create table if not exists public.notifications (
  id         bigserial primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  kind       text not null,           -- e.g., 'message','offer','payout_ready'
  payload    jsonb default '{}'::jsonb,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname='notif_owner_rw' and tablename='notifications') then
    create policy notif_owner_rw on public.notifications for all
      using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
end $$;
create index if not exists notif_user_idx on public.notifications(user_id, created_at desc);
create index if not exists notif_unread_idx on public.notifications(user_id) where read_at is null;

-- ========== orders (manual GCash soft launch) ==========
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  gig_id          bigint references public.gigs(id) on delete set null,
  amount_php      integer not null check (amount_php > 0),
  status          order_status not null default 'pending',
  proof_url       text,
  reference_code  text,
  expires_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table public.orders enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname='orders_select_own' and tablename='orders') then
    create policy orders_select_own on public.orders for select
      using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname='orders_insert_own' and tablename='orders') then
    create policy orders_insert_own on public.orders for insert
      with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname='orders_update_own_pending' and tablename='orders') then
    create policy orders_update_own_pending on public.orders for update
      using (auth.uid() = user_id and status in ('pending','submitted'))
      with check (auth.uid() = user_id and status in ('pending','submitted'));
  end if;
  if not exists (select 1 from pg_policies where policyname='orders_no_delete' and tablename='orders') then
    create policy orders_no_delete on public.orders for delete using (false);
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_trigger where tgname='_orders_set_updated_at') then
    create trigger _orders_set_updated_at before update on public.orders
      for each row execute function public.set_updated_at();
  end if;
end $$;
create index if not exists orders_user_idx on public.orders(user_id, created_at desc);

-- ========== Storage (bucket: assets) ==========
insert into storage.buckets (id, name, public)
values ('assets','assets', true)
on conflict (id) do nothing;

-- storage policies on objects
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='assets_public_read') then
    create policy assets_public_read on storage.objects for select
      using (bucket_id = 'assets');
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='assets_auth_write') then
    create policy assets_auth_write on storage.objects for insert
      with check (bucket_id = 'assets' and auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='assets_auth_update') then
    create policy assets_auth_update on storage.objects for update
      using (bucket_id = 'assets' and auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='assets_auth_delete') then
    create policy assets_auth_delete on storage.objects for delete
      using (bucket_id = 'assets' and auth.role() = 'authenticated');
  end if;
end $$;

-- ========== Realtime publication ==========
do $$ begin
  perform 1 from pg_publication where pubname = 'supabase_realtime';
  if found then
    execute 'alter publication supabase_realtime add table if not exists public.messages';
    execute 'alter publication supabase_realtime add table if not exists public.applications';
    execute 'alter publication supabase_realtime add table if not exists public.message_reads';
    execute 'alter publication supabase_realtime add table if not exists public.notifications';
  end if;
end $$;

-- ========== Verification ==========
-- Tables
select 'tables_present' as check, array_agg(tablename) as ok
from pg_tables
where schemaname='public' and tablename = any (array['profiles','gigs','applications','messages','message_reads','notifications','orders']);

-- RLS enabled
select 'rls_enabled' as check, array_agg(relname) as ok
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and relname = any (array['profiles','gigs','applications','messages','message_reads','notifications','orders'])
  and exists (select 1 from pg_catalog.pg_policy p where p.polrelid=c.oid);

-- Policies overview
select policyname, schemaname, tablename, cmd from pg_policies
where (schemaname='public' and tablename in ('profiles','gigs','applications','messages','message_reads','notifications','orders'))
   or (schemaname='storage' and tablename='objects')
order by schemaname, tablename, policyname;

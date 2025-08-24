-- 1) Feature flags (simple key/value)
create table if not exists public.feature_flags (
  key text primary key,
  enabled boolean not null default false,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create trigger feature_flags_updated_trg
before update on public.feature_flags
for each row execute procedure moddatetime (updated_at);

-- 2) Review moderation (if not present)
-- Assumes public.reviews(id uuid pk, job_id uuid, reviewer_id uuid, reviewee_id uuid, rating int, comment text, created_at)
alter table public.reviews
  add column if not exists hidden boolean not null default false,
  add column if not exists hidden_by uuid references auth.users(id),
  add column if not exists hidden_reason text;

-- 3) RLS policies
alter table public.feature_flags enable row level security;

-- Allow public read if needed (optional: toggle flags client-side)
create policy "feature_flags_read_all" on public.feature_flags
  for select using (true);

-- Only admins can upsert flags via RPC (see RPC below); no direct write policy.

-- 4) RPCs (admin-only via role check)
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid and coalesce(p.role,'') = 'admin'
  );
$$;

create or replace function public.admin_set_flag(p_key text, p_enabled boolean)
returns void language plpgsql security definer as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'forbidden';
  end if;

  insert into public.feature_flags(key, enabled, updated_by)
  values (p_key, p_enabled, auth.uid())
  on conflict (key) do update
    set enabled = excluded.enabled,
        updated_by = excluded.updated_by,
        updated_at = now();
end;
$$;

create or replace function public.admin_hide_review(p_review uuid, p_reason text)
returns void language plpgsql security definer as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'forbidden';
  end if;
  update public.reviews
  set hidden = true, hidden_by = auth.uid(), hidden_reason = p_reason
  where id = p_review;
end;
$$;

create or replace function public.admin_unhide_review(p_review uuid)
returns void language plpgsql security definer as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'forbidden';
  end if;
  update public.reviews
  set hidden = false, hidden_by = null, hidden_reason = null
  where id = p_review;
end;
$$;

-- Optional: soft-suspend a user (adds 'suspended_at' to profiles)
alter table public.profiles
  add column if not exists suspended_at timestamptz;

create or replace function public.admin_suspend_user(p_user uuid)
returns void language plpgsql security definer as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'forbidden';
  end if;
  update public.profiles set suspended_at = now() where id = p_user;
end;
$$;

create or replace function public.admin_unsuspend_user(p_user uuid)
returns void language plpgsql security definer as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'forbidden';
  end if;
  update public.profiles set suspended_at = null where id = p_user;
end;
$$;

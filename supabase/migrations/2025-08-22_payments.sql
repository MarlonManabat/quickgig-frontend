-- Profiles: payout fields
alter table if exists public.profiles
  add column if not exists stripe_account_id text,
  add column if not exists stripe_payout_ready boolean default false;

-- RLS: gate offers insert by payout_ready
do $$ begin
  -- rebuild insert policy with payout check
  drop policy if exists "offers_insert_owner" on public.offers;
  create policy "offers_insert_owner"
  on public.offers for insert to authenticated
  with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and coalesce(p.stripe_payout_ready,false) = true
    )
  );
exception when undefined_object then null; end $$;

-- ensure notifications enum has payout_ready
do $$ begin
  alter type public.notification_type add value if not exists 'payout_ready';
exception when duplicate_object then null; end $$;

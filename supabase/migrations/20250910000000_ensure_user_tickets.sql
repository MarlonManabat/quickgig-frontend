-- Ensure table exists; one row per user
create table if not exists public.user_tickets (
  user_id uuid primary key,
  balance integer not null default 0
);

-- Optional ledger for audit if not existing (no-op if you already have one)
create table if not exists public.ticket_ledger (
  id bigserial primary key,
  user_id uuid not null,
  change integer not null,
  reason text not null,
  gig_id bigint,
  created_at timestamptz not null default now()
);

-- Helper function to seed on first login (no update on existing rows)
create or replace function public.ensure_tickets_row(p_user uuid, p_init integer)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.user_tickets (user_id, balance)
  values (p_user, greatest(coalesce(p_init, 0), 0))
  on conflict (user_id) do nothing;
end $$;

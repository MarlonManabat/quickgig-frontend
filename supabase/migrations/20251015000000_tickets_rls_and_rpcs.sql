-- Enable RLS
alter table public.ticket_ledger enable row level security;

-- Only owners can read their rows
drop policy if exists "ticket_ledger: read own" on public.ticket_ledger;
drop policy if exists "ticket_ledger: admin read all" on public.ticket_ledger;
drop policy if exists "owner_can_select_tickets" on public.ticket_ledger;
create policy "owner_can_select_tickets"
on public.ticket_ledger
for select
to authenticated
using (user_id = auth.uid());

-- Block direct inserts/updates/deletes from clients; we’ll use SECURITY DEFINER funcs
revoke insert, update, delete on public.ticket_ledger from anon, authenticated;

-- Helpful index
create index if not exists ticket_ledger_user_created_idx
  on public.ticket_ledger (user_id, created_at desc);

-- Balance function
create or replace function public.ticket_balance(p_user uuid default auth.uid())
returns integer
language sql
stable
as $$
  select coalesce(sum(delta), 0)::int
  from public.ticket_ledger
  where user_id = p_user
$$;

grant execute on function public.ticket_balance(uuid) to anon, authenticated;

-- One-time signup bonus (3 tickets) if not already granted
create or replace function public.award_signup_bonus()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  has_bonus boolean;
begin
  select exists (
    select 1 from public.ticket_ledger
    where user_id = auth.uid()
      and reason = 'signup_bonus'
  ) into has_bonus;

  if not has_bonus then
    insert into public.ticket_ledger(user_id, delta, reason, ref_type, ref_id)
    values (auth.uid(), 3, 'signup_bonus', 'system', null);
  end if;

  return public.ticket_balance(auth.uid());
end;
$$;

grant execute on function public.award_signup_bonus() to authenticated;

-- Spend exactly 1 ticket with a reason
create or replace function public.spend_one_ticket(p_reason text, p_meta jsonb default '{}'::jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  bal int;
  v_ref_type text;
  v_ref_id uuid;
begin
  bal := public.ticket_balance(auth.uid());
  if bal < 1 then
    raise exception 'INSUFFICIENT_TICKETS';
  end if;

  v_ref_type := coalesce(p_meta->>'ref_type', null);
  v_ref_id := (p_meta->>'ref_id')::uuid;

  insert into public.ticket_ledger(user_id, delta, reason, ref_type, ref_id)
  values (auth.uid(), -1, coalesce(p_reason, 'spend'), v_ref_type, v_ref_id);

  return public.ticket_balance(auth.uid());
end;
$$;

grant execute on function public.spend_one_ticket(text, jsonb) to authenticated;

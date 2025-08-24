-- 1) Payments table (manual GCash receipts)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  amount_php numeric(10,2) not null check (amount_php > 0),
  expected_tickets int not null check (expected_tickets > 0),
  gcash_reference text not null,
  status text not null check (status in ('pending','approved','rejected')) default 'pending',
  admin_id uuid references auth.users(id),
  admin_note text
);

create unique index if not exists payments_gcash_reference_ux
  on public.payments (lower(gcash_reference));

create index if not exists payments_user_status_idx
  on public.payments (user_id, status);

create trigger payments_updated_at_trg
before update on public.payments
for each row execute procedure moddatetime (updated_at);

-- 2) Tickets ledger (auditable credits/debits)
create table if not exists public.tickets_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('credit','debit','refund')),
  qty int not null check (qty > 0),
  reason text not null,
  ref_id uuid,              -- e.g., payment id or match id
  ref_table text            -- 'payments' | 'matches' | 'admin'
);

create index if not exists tickets_ledger_user_idx
  on public.tickets_ledger (user_id, created_at desc);

-- 3) Ticket balance view (fast read)
create or replace view public.v_ticket_balances as
  select user_id,
         coalesce(sum(case when kind='credit' then qty
                           when kind='refund' then qty
                           when kind='debit'  then -qty
                      end),0) as balance
  from public.tickets_ledger
  group by user_id;

-- 4) Match agreements guard (only deduct when both agreed)
-- Assumes existing matches table with columns:
-- id uuid pk, employer_id uuid, worker_id uuid, status text, agreed_at timestamptz, ...
-- We will not change schema; we add a trigger to enforce debit-on-both-agree once.
create table if not exists public.match_ticket_deductions (
  match_id uuid primary key,
  employer_debited bool not null default false,
  worker_debited   bool not null default false,
  created_at timestamptz not null default now()
);

-- Helper: function to current balance
create or replace function public.fn_ticket_balance(p_user uuid)
returns int language sql stable as $$
  select coalesce(b.balance,0) from public.v_ticket_balances b where b.user_id = p_user
$$;

-- Trigger fn: when a match transitions to agreed, deduct 1 ticket from BOTH sides once.
create or replace function public.trg_on_matches_agreed()
returns trigger language plpgsql as $$
declare
  already boolean;
begin
  -- Only fire when moving into agreed state
  if (tg_op = 'UPDATE') and (new.status = 'agreed') and (old.status is distinct from 'agreed') then
    -- Ensure we only process once per match
    select exists (select 1 from public.match_ticket_deductions where match_id = new.id) into already;
    if not already then
      -- Check balances
      if public.fn_ticket_balance(new.employer_id) < 1 or public.fn_ticket_balance(new.worker_id) < 1 then
        raise exception 'Insufficient tickets for one or both parties';
      end if;

      -- Debit both
      insert into public.tickets_ledger(user_id, kind, qty, reason, ref_id, ref_table)
      values
        (new.employer_id, 'debit', 1, 'match_agreed', new.id, 'matches'),
        (new.worker_id,   'debit', 1, 'match_agreed', new.id, 'matches');

      insert into public.match_ticket_deductions(match_id, employer_debited, worker_debited)
      values (new.id, true, true);
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists on_matches_agreed_trg on public.matches;
create trigger on_matches_agreed_trg
after update on public.matches
for each row execute function public.trg_on_matches_agreed();

-- 5) Refunds within window
-- Simple RPC: refund both parties if match is canceled within X hours
create or replace function public.rpc_refund_match_tickets(p_match uuid)
returns void
language plpgsql
security definer
as $$
declare
  m record;
  hrs int := coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'refund_hours', null)::int;
  refund_window_hours int := coalesce(hrs, 12);
  did boolean;
begin
  select * into m from public.matches where id = p_match;
  if m is null then raise exception 'Match not found'; end if;

  -- Verify cancel and within window
  if m.status <> 'canceled' then raise exception 'Match not canceled'; end if;
  if m.agreed_at is null then raise exception 'No agreed_at to base refund window'; end if;
  if now() > (m.agreed_at + (refund_window_hours || ' hours')::interval) then
    raise exception 'Refund window elapsed';
  end if;

  -- Only if we previously debited
  select exists (select 1 from public.match_ticket_deductions where match_id = p_match) into did;
  if not did then return; end if;

  insert into public.tickets_ledger(user_id, kind, qty, reason, ref_id, ref_table)
  values
    (m.employer_id, 'refund', 1, 'match_canceled_within_window', p_match, 'matches'),
    (m.worker_id,   'refund', 1, 'match_canceled_within_window', p_match, 'matches');
end;
$$;

-- 6) Credits from payments (admin approves)
create or replace function public.rpc_admin_approve_payment(p_payment uuid, p_note text default null)
returns void
language plpgsql
security definer
as $$
declare
  p record;
begin
  select * into p from public.payments where id = p_payment for update;
  if p is null then raise exception 'Payment not found'; end if;
  if p.status <> 'pending' then raise exception 'Payment not pending'; end if;

  update public.payments
  set status='approved', admin_id = auth.uid(), admin_note = p_note, updated_at = now()
  where id = p_payment;

  insert into public.tickets_ledger(user_id, kind, qty, reason, ref_id, ref_table)
  values (p.user_id, 'credit', p.expected_tickets, 'gcash_payment_approved', p.id, 'payments');
end;
$$;

create or replace function public.rpc_admin_reject_payment(p_payment uuid, p_reason text)
returns void
language plpgsql
security definer
as $$
declare
  p record;
begin
  select * into p from public.payments where id = p_payment for update;
  if p is null then raise exception 'Payment not found'; end if;
  if p.status <> 'pending' then raise exception 'Payment not pending'; end if;

  update public.payments
  set status='rejected', admin_id = auth.uid(), admin_note = p_reason, updated_at = now()
  where id = p_payment;
end;
$$;

-- 7) RLS
alter table public.payments enable row level security;
alter table public.tickets_ledger enable row level security;
alter table public.match_ticket_deductions enable row level security;

-- Payments RLS: users read own, create pending; admins read all & approve/reject via RPC
create policy "payments_owner_rw" on public.payments
  for select using (auth.uid() = user_id);
create policy "payments_owner_insert" on public.payments
  for insert with check (auth.uid() = user_id);
create policy "payments_admin_read" on public.payments
  for select using (exists (select 1 from public.profiles pr where pr.id = auth.uid() and pr.role = 'admin'));

-- Tickets ledger: users read own rows
create policy "tickets_owner_read" on public.tickets_ledger
  for select using (auth.uid() = user_id);

-- Expose RPCs
-- (Supabase exposes all functions in public schema by default; ensure anon is denied by JWT claims role)

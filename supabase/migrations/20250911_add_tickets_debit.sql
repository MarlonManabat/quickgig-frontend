-- Tickets debit RPC (mirror style of existing refund logic)
create or replace function public.tickets_debit(
  p_user_id uuid,
  p_amount numeric,
  p_meta jsonb default '{}'::jsonb
)
returns void
language plpgsql
as $$
begin
  -- ensure positive amount; store as negative delta
  insert into public.tickets_ledger(user_id, delta, reason, meta)
  values (p_user_id, -abs(p_amount), 'debit', coalesce(p_meta, '{}'::jsonb));
end
$$;

-- permissions (adjust if your roles differ)
grant execute on function public.tickets_debit(uuid, numeric, jsonb) to anon, authenticated, service_role;

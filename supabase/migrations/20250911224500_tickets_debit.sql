-- Tickets debit RPC
create or replace function public.tickets_debit(
  employer_id uuid,
  agreement_id uuid,
  amount numeric
)
returns void
language plpgsql
security definer
as $$
begin
  if amount <= 0 then
    raise exception 'amount_must_be_positive';
  end if;

  insert into public.tickets_ledger (user_id, agreement_id, delta, note)
  values (employer_id, agreement_id, -amount, 'agreement confirm debit');
end
$$;

grant execute on function public.tickets_debit(uuid, uuid, numeric) to service_role;

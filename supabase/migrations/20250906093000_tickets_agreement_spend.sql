-- Atomic burn: 1 ticket from employer and seeker when an agreement is finalized
-- Uses existing ticket_ledger and tickets_balance() helpers.

create or replace function public.tickets_agreement_spend(
  p_employer uuid,
  p_seeker   uuid,
  p_agreement uuid
) returns table (employer_balance int, seeker_balance int)
language plpgsql
security definer
as $$
declare
  bal_e int;
  bal_s int;
begin
  -- pre-checks
  select public.tickets_balance(p_employer) into bal_e;
  select public.tickets_balance(p_seeker)   into bal_s;
  if coalesce(bal_e,0) < 1 then
    raise exception 'employer_insufficient_tickets';
  end if;
  if coalesce(bal_s,0) < 1 then
    raise exception 'seeker_insufficient_tickets';
  end if;

  -- burn
  insert into public.ticket_ledger (user_id, delta, source, ref_id)
  values
    (p_employer, -1, 'agreement', p_agreement),
    (p_seeker,   -1, 'agreement', p_agreement);

  employer_balance := public.tickets_balance(p_employer);
  seeker_balance   := public.tickets_balance(p_seeker);
  return;
end
$$;

-- Allow server and authenticated calls; function is security definer.
revoke all on function public.tickets_agreement_spend(uuid, uuid, uuid) from public;
grant execute on function public.tickets_agreement_spend(uuid, uuid, uuid) to anon, authenticated, service_role;

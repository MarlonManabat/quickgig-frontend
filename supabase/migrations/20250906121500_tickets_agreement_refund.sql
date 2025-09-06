-- Refund 1 ticket to both parties if an agreement that previously burned tickets is cancelled.
-- Idempotent: will error if no prior burn or if refund already recorded.

create or replace function public.tickets_agreement_refund(
  p_employer  uuid,
  p_seeker    uuid,
  p_agreement uuid
) returns table (employer_balance int, seeker_balance int)
language plpgsql
security definer
as $$
declare
  burns int;
  refunds int;
begin
  -- Count existing burns and refunds tied to this agreement for both users.
  select count(*) into burns
  from public.ticket_ledger
  where ref_id = p_agreement
    and source = 'agreement'
    and user_id in (p_employer, p_seeker);

  select count(*) into refunds
  from public.ticket_ledger
  where ref_id = p_agreement
    and source = 'agreement_refund'
    and user_id in (p_employer, p_seeker);

  if burns < 2 then
    raise exception 'no_prior_burn_for_agreement';
  end if;

  if refunds >= 2 then
    raise exception 'already_refunded';
  end if;

  -- Perform refund ( +1 both sides )
  insert into public.ticket_ledger (user_id, delta, source, ref_id)
  values
    (p_employer, +1, 'agreement_refund', p_agreement),
    (p_seeker,   +1, 'agreement_refund', p_agreement);

  employer_balance := public.tickets_balance(p_employer);
  seeker_balance   := public.tickets_balance(p_seeker);
  return;
end
$$;

-- Prevent accidental duplicate entries per (user, agreement, source)
create unique index if not exists ux_ticket_ledger_user_agreement_source
  on public.ticket_ledger (user_id, ref_id, source);

revoke all on function public.tickets_agreement_refund(uuid, uuid, uuid) from public;
grant execute on function public.tickets_agreement_refund(uuid, uuid, uuid) to anon, authenticated, service_role;

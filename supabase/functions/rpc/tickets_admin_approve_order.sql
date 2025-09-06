create or replace function public.tickets_admin_approve_order(p_order_id uuid, p_note text default null)
returns int
language plpgsql
security definer
set search_path = public as $$
declare
  ord record;
  new_balance int;
begin
  select * into ord from ticket_orders where id = p_order_id for update;
  if not found then
    raise exception 'order_not_found';
  end if;
  if ord.status <> 'pending' then
    raise exception 'order_not_pending';
  end if;

  update ticket_orders set status = 'approved', admin_note = p_note where id = p_order_id;

  perform admin_grant_tickets(ord.user_id, ord.qty, p_note);

  select balance into new_balance from ticket_balance_view where user_id = ord.user_id;
  return new_balance;
end;
$$;

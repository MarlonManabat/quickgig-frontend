create or replace function public.tickets_admin_reject_order(p_order_id uuid, p_note text)
returns void
language plpgsql
security definer
set search_path = public as $$
begin
  update ticket_orders set status = 'rejected', admin_note = p_note where id = p_order_id;
end;
$$;

-- idempotent wrapper so old clients calling `create_gig_public` won't break
-- keeps ticket enforcement by deferring to the internal/primary function

-- choose the internal function we already created in the new model:
-- rpc_debit_tickets_and_create_gig(p_title text, p_description text, p_region_code text, p_city_code text, p_price_php int, p_user_id uuid)
-- If your internal name differs, update the SELECT below (only that line).

create or replace function public.create_gig_public(
  p_title text,
  p_description text,
  p_region_code text,
  p_city_code text,
  p_price_php integer
)
returns table (gig_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_gig_id uuid;
begin
  if v_uid is null then
    raise exception 'auth required';
  end if;

  -- delegate to the real function that does ticket checks + insert
  select id into v_gig_id
  from public.rpc_debit_tickets_and_create_gig(
    p_title, p_description, p_region_code, p_city_code, p_price_php, v_uid
  );

  return query select v_gig_id;
end $$;

-- expose to signed-in clients only
grant execute on function public.create_gig_public(text, text, text, text, integer) to authenticated;
revoke execute on function public.create_gig_public(text, text, text, text, integer) from anon;

-- make sure PostgREST sees the new function right away
do $$ begin
  perform pg_notify('pgrst', 'reload schema');
exception when others then
  -- no-op if channel missing
  null;
end $$;

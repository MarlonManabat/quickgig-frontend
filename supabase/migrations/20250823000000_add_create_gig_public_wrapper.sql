-- create or replace wrapper so frontend can keep calling the old name/signature
create or replace function public.create_gig_public(
  p_title text,
  p_description text,
  p_region_code text,
  p_city_code text,
  p_price_php integer
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_gig_id uuid;
begin
  if v_user is null then
    raise exception 'UNAUTHENTICATED';
  end if;

  -- Call the new function that also debits tickets atomically.
  -- Adjust the target function name/args if your canonical RPC differs:
  select * into v_gig_id
  from public.rpc_debit_tickets_and_create_gig(
    p_user_id     => v_user,
    p_title       => p_title,
    p_description => p_description,
    p_region_code => p_region_code,
    p_city_code   => p_city_code,
    p_price_php   => p_price_php
  );

  return v_gig_id;
end;
$$;

-- Make sure callers can execute it
grant execute on function public.create_gig_public(text, text, text, text, integer) to anon, authenticated;

-- Help PostgREST pick up the new RPC immediately
do $$
begin
  perform pg_notify('pgrst', 'reload schema');
exception when others then
  -- ignore if pgrst channel not available
  null;
end$$;

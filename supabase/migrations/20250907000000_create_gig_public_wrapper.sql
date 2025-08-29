-- Ensure wrapper exists for the app form:
-- signature: create_gig_public(p_region_code text, p_city_code text, p_title text, p_description text, p_price_php integer)
-- Uses auth.uid() internally. Debits a ticket and creates a gig via the new RPC.

create schema if not exists public;

-- Create the underlying RPC if it doesn't exist (no-op if already present).
-- Adjust the called RPC name if your final function differs.
-- We won't attempt to redefine it here; we rely on the existing implementation.

create or replace function public.create_gig_public(
  p_region_code text,
  p_city_code   text,
  p_title       text,
  p_description text,
  p_price_php   integer
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_gig_id uuid;
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;

  -- Call the new ticket-aware RPC.
  -- If your canonical function name is different, update below.
  select * into v_gig_id
  from public.rpc_debit_tickets_and_create_gig(
    p_user_id     => v_user,
    p_region_code => p_region_code,
    p_city_code   => p_city_code,
    p_title       => p_title,
    p_description => p_description,
    p_price_php   => p_price_php
  );

  return v_gig_id;
exception
  when undefined_function then
    -- If the new RPC isn’t present yet, surface a clear error
    raise exception 'Back-end RPC not deployed: rpc_debit_tickets_and_create_gig';
end;
$$;

-- Permissions
revoke all on function public.create_gig_public(text, text, text, text, integer) from public;
grant execute on function public.create_gig_public(text, text, text, text, integer) to authenticated;

-- (Optional) RLS note: Ensure gig insert policies already allow SECURITY DEFINER writer.

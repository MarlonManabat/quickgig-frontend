-- 1) Ensure ticket type includes a credit from admin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'ticket_entry_type' AND e.enumlabel = 'admin_grant'
  ) THEN
    ALTER TYPE ticket_entry_type ADD VALUE 'admin_grant';
  END IF;
END$$;

-- 2) Helper RPC: admin_grant_tickets (SECURITY DEFINER for audit convenience)
-- NOTE: We still call this via service role from our API after verifying admin;
-- this RPC keeps a single place to insert and validate.
CREATE OR REPLACE FUNCTION public.admin_grant_tickets(p_user uuid, p_amount int, p_note text DEFAULT 'admin grant')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'amount must be > 0';
  END IF;

  INSERT INTO ticket_ledger(user_id, entry_type, qty, meta)
  VALUES (p_user, 'admin_grant', p_amount, jsonb_build_object('note', coalesce(p_note,'admin grant')));

  -- Optional: touch a materialized balance table if you keep one (skip if not present)
END$$;

-- 3) Ensure balance calculation treats 'admin_grant' as credit.
-- If you have a balance view/function, update it to sum qty where entry_type in ('signup_bonus','admin_grant') minus debits (e.g., 'agreement_burn').
-- Example (adapt if names differ):

CREATE OR REPLACE VIEW public.ticket_balance_view AS
SELECT
  u.id AS user_id,
  COALESCE((
    SELECT
      COALESCE(SUM(CASE WHEN entry_type IN ('signup_bonus','admin_grant') THEN qty ELSE 0 END),0)
      - COALESCE(SUM(CASE WHEN entry_type IN ('agreement_burn') THEN qty ELSE 0 END),0)
    FROM ticket_ledger tl
    WHERE tl.user_id = u.id
  ),0)::int AS balance
FROM auth.users u;  -- adapt if your users live elsewhere

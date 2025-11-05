-- Add columns needed by frontend to gigs table
-- This makes the database schema compatible with the frontend expectations

BEGIN;

-- Add company column (can be null, will be derived from owner profile)
ALTER TABLE public.gigs 
ADD COLUMN IF NOT EXISTS company text;

-- Add region column for Philippine region filtering
ALTER TABLE public.gigs 
ADD COLUMN IF NOT EXISTS region text;

-- Add rate column (single rate value, alternative to budget)
ALTER TABLE public.gigs 
ADD COLUMN IF NOT EXISTS rate numeric(12,2);

-- Add pay_min and pay_max for salary ranges
ALTER TABLE public.gigs 
ADD COLUMN IF NOT EXISTS pay_min numeric(12,2);

ALTER TABLE public.gigs 
ADD COLUMN IF NOT EXISTS pay_max numeric(12,2);

-- Add remote flag
ALTER TABLE public.gigs 
ADD COLUMN IF NOT EXISTS remote boolean DEFAULT false;

-- Update status check to include 'open' and 'closed' (frontend expects these)
ALTER TABLE public.gigs 
DROP CONSTRAINT IF EXISTS gigs_status_check;

ALTER TABLE public.gigs 
ADD CONSTRAINT gigs_status_check 
CHECK (status IN ('draft','published','closed','open'));

-- Create index on region for filtering
CREATE INDEX IF NOT EXISTS gigs_region_idx ON public.gigs(region);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS gigs_status_idx ON public.gigs(status);

COMMIT;


-- ============================================
-- QuickGig.ph Complete Database Deployment
-- ============================================
-- This script sets up the entire database schema and seed data
-- Run this in Supabase SQL Editor to deploy everything at once
--
-- IMPORTANT: This assumes you're running on a fresh database
-- or that you want to add/update the schema safely
-- ============================================

BEGIN;

-- ============================================
-- STEP 1: Add missing columns to gigs table
-- ============================================

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

-- Add published flag (alternative to status='published')
ALTER TABLE public.gigs 
ADD COLUMN IF NOT EXISTS published boolean DEFAULT false;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS gigs_region_idx ON public.gigs(region);
CREATE INDEX IF NOT EXISTS gigs_status_idx ON public.gigs(status);
CREATE INDEX IF NOT EXISTS gigs_published_idx ON public.gigs(published);
CREATE INDEX IF NOT EXISTS gigs_company_idx ON public.gigs(company);

-- ============================================
-- STEP 2: Insert sample profiles
-- ============================================

INSERT INTO public.profiles (id, full_name, avatar_url, role, can_post_job, created_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Maria Santos', null, 'user', true, now()),
  ('22222222-2222-2222-2222-222222222222', 'Juan Dela Cruz', null, 'user', true, now()),
  ('33333333-3333-3333-3333-333333333333', 'Admin User', null, 'admin', true, now())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  can_post_job = EXCLUDED.can_post_job;

-- ============================================
-- STEP 3: Grant tickets to demo users
-- ============================================

-- Grant 10 tickets to each demo user (if ticket system exists)
DO $$
BEGIN
  -- Check if ticket functions exist before calling
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'credit_tickets_admin') THEN
    PERFORM public.credit_tickets_admin('11111111-1111-1111-1111-111111111111', 10, 'seed_data', null);
    PERFORM public.credit_tickets_admin('22222222-2222-2222-2222-222222222222', 10, 'seed_data', null);
    PERFORM public.credit_tickets_admin('33333333-3333-3333-3333-333333333333', 100, 'seed_data_admin', null);
    RAISE NOTICE 'Tickets granted successfully';
  ELSE
    RAISE NOTICE 'Ticket system not yet installed - skipping ticket grants';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Could not grant tickets: %', SQLERRM;
END $$;

-- ============================================
-- STEP 4: Insert sample gigs
-- ============================================

INSERT INTO public.gigs (
  id, owner, title, description, budget, location, status, paid, 
  created_at, company, region, rate, pay_min, pay_max, remote, published
)
VALUES 
  (
    'a1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Web Developer Needed',
    'Looking for an experienced web developer to build a modern e-commerce website. Must have experience with React, Next.js, and Tailwind CSS. This is a full-time remote position with competitive salary.',
    50000,
    'Quezon City',
    'published',
    true,
    now() - interval '2 days',
    'TechStart Philippines',
    'National Capital Region',
    50000,
    45000,
    55000,
    false,
    true
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Graphic Designer for Marketing',
    'Need a creative graphic designer to create marketing materials for our new product launch. Experience with Adobe Creative Suite required. Flexible hours, can work remotely.',
    25000,
    'Cebu City',
    'published',
    true,
    now() - interval '1 day',
    'Creative Agency Cebu',
    'Central Visayas (Region VII)',
    25000,
    20000,
    30000,
    true,
    true
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Mobile App Developer',
    'Seeking a skilled mobile app developer to create a food delivery app for iOS and Android. Flutter or React Native experience preferred. Full-time position with benefits.',
    75000,
    'Makati City',
    'published',
    true,
    now() - interval '3 hours',
    'FoodTech Solutions',
    'National Capital Region',
    75000,
    70000,
    80000,
    false,
    true
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'Content Writer',
    'Looking for a talented content writer to create blog posts and social media content. Must have excellent English writing skills. Part-time, flexible schedule.',
    15000,
    'Remote',
    'published',
    true,
    now() - interval '5 hours',
    'Digital Marketing Hub',
    'National Capital Region',
    15000,
    12000,
    18000,
    true,
    true
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Virtual Assistant',
    'Need a reliable virtual assistant for administrative tasks, email management, and scheduling. Must be available during PH business hours. Remote work.',
    20000,
    'Remote',
    'published',
    true,
    now() - interval '1 hour',
    'BPO Services Inc',
    'CALABARZON (Region IV-A)',
    20000,
    18000,
    22000,
    true,
    true
  ),
  (
    'a6666666-6666-6666-6666-666666666666',
    '22222222-2222-2222-2222-222222222222',
    'Social Media Manager',
    'Seeking an experienced social media manager to handle our Facebook, Instagram, and TikTok accounts. Must have proven track record of growing social media presence.',
    30000,
    'Davao City',
    'published',
    true,
    now() - interval '30 minutes',
    'E-commerce Startup',
    'Davao Region (Region XI)',
    30000,
    28000,
    35000,
    true,
    true
  ),
  (
    'a7777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    'Data Entry Specialist',
    'Looking for detail-oriented data entry specialists for a 3-month project. Fast typing speed and accuracy required. On-site work in Manila.',
    12000,
    'Manila',
    'published',
    true,
    now() - interval '15 minutes',
    'Data Solutions Corp',
    'National Capital Region',
    12000,
    10000,
    14000,
    false,
    true
  ),
  (
    'a8888888-8888-8888-8888-888888888888',
    '22222222-2222-2222-2222-222222222222',
    'Video Editor',
    'Need a skilled video editor for YouTube content. Experience with Premiere Pro and After Effects required. Remote work, flexible hours.',
    35000,
    'Remote',
    'published',
    true,
    now() - interval '2 hours',
    'Content Creator Network',
    'Central Luzon (Region III)',
    35000,
    30000,
    40000,
    true,
    true
  ),
  (
    'a9999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    'Customer Service Representative',
    'Hiring customer service representatives for our e-commerce platform. Must have excellent communication skills. On-site work in Quezon City.',
    18000,
    'Quezon City',
    'published',
    true,
    now() - interval '4 hours',
    'Online Retail PH',
    'National Capital Region',
    18000,
    16000,
    20000,
    false,
    true
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    'SEO Specialist',
    'Looking for an SEO specialist to improve our website rankings. Must have experience with Google Analytics and SEO tools. Remote work available.',
    28000,
    'Remote',
    'published',
    true,
    now() - interval '6 hours',
    'Digital Growth Agency',
    'National Capital Region',
    28000,
    25000,
    32000,
    true,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  company = EXCLUDED.company,
  region = EXCLUDED.region,
  rate = EXCLUDED.rate,
  pay_min = EXCLUDED.pay_min,
  pay_max = EXCLUDED.pay_max,
  remote = EXCLUDED.remote,
  published = EXCLUDED.published;

COMMIT;

-- ============================================
-- STEP 5: Display summary
-- ============================================

DO $$
DECLARE
  profile_count int;
  gig_count int;
  ticket_count int := 0;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  SELECT COUNT(*) INTO gig_count FROM public.gigs WHERE status = 'published' OR published = true;
  
  -- Check if ticket_balances table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ticket_balances') THEN
    SELECT COALESCE(SUM(balance), 0) INTO ticket_count FROM public.ticket_balances;
  END IF;
  
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'QuickGig.ph Database Deployment Complete!';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Total Profiles: %', profile_count;
  RAISE NOTICE 'Published Gigs: %', gig_count;
  RAISE NOTICE 'Total Tickets: %', ticket_count;
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Verify environment variables in Vercel';
  RAISE NOTICE '2. Redeploy the application';
  RAISE NOTICE '3. Test at https://app.quickgig.ph';
  RAISE NOTICE '===========================================';
END $$;

-- ============================================
-- Deployment complete!
-- ============================================


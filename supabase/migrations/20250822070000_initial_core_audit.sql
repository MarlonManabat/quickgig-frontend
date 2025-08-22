-- 20250822_initial_core_audit.sql
-- Foundation schema, helper fn, tables, indexes, and RLS policies for QuickGig.
-- Idempotent: safe to re-run.

BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- Helper: is_admin()
-- =========================
-- Returns true if the current auth.uid() maps to a profiles row with role='admin'.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
$$;

-- =========================
-- Tables
-- =========================

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  text,
  avatar_url text,
  role       text NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  can_post_job boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- gigs
CREATE TABLE IF NOT EXISTS public.gigs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  budget      numeric(12,2),
  location    text,
  status      text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','closed')),
  paid        boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- applications
CREATE TABLE IF NOT EXISTS public.applications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id      uuid NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  applicant   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter text,
  status      text NOT NULL DEFAULT 'applied' CHECK (status IN ('applied','shortlisted','offered','hired','rejected')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- threads
CREATE TABLE IF NOT EXISTS public.threads (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- messages
CREATE TABLE IF NOT EXISTS public.messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  uuid NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  sender     uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- offers
CREATE TABLE IF NOT EXISTS public.offers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  terms         jsonb,
  status        text NOT NULL DEFAULT 'open' CHECK (status IN ('open','accepted','declined','expired')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- orders (manual GCash)
CREATE TABLE IF NOT EXISTS public.orders (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gig_id       uuid REFERENCES public.gigs(id) ON DELETE SET NULL,
  amount       numeric(12,2) NOT NULL,
  status       text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','under_review','approved','rejected')),
  proof_url    text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  reviewed_by  uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at  timestamptz
);

-- notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       text NOT NULL,
  payload    jsonb,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- Triggers
-- =========================
-- updated_at on gigs
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS tr_gigs_set_updated ON public.gigs;
CREATE TRIGGER tr_gigs_set_updated
BEFORE UPDATE ON public.gigs
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================
-- Indexes
-- =========================
CREATE INDEX IF NOT EXISTS idx_gigs_owner ON public.gigs(owner);
CREATE INDEX IF NOT EXISTS idx_gigs_created_at ON public.gigs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_apps_gig ON public.applications(gig_id);
CREATE INDEX IF NOT EXISTS idx_apps_applicant ON public.applications(applicant);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON public.messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_offers_app ON public.offers(application_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- =========================
-- RLS
-- =========================
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper for IF-NOT-EXISTS on policies
-- We emulate IF NOT EXISTS via DO blocks checking pg_policies.

-- PROFILES
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_select_self_or_admin') THEN
    CREATE POLICY profiles_select_self_or_admin ON public.profiles
      FOR SELECT
      USING ( id = auth.uid() OR public.is_admin() );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_update_self_or_admin') THEN
    CREATE POLICY profiles_update_self_or_admin ON public.profiles
      FOR UPDATE
      USING ( id = auth.uid() OR public.is_admin() )
      WITH CHECK ( id = auth.uid() OR public.is_admin() );
  END IF;
END$$;

-- GIGS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gigs' AND policyname='gigs_select_published_owner_admin') THEN
    CREATE POLICY gigs_select_published_owner_admin ON public.gigs
      FOR SELECT
      USING ( status='published' OR owner = auth.uid() OR public.is_admin() );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gigs' AND policyname='gigs_insert_owner_or_admin') THEN
    CREATE POLICY gigs_insert_owner_or_admin ON public.gigs
      FOR INSERT
      WITH CHECK ( owner = auth.uid() OR public.is_admin() );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gigs' AND policyname='gigs_update_owner_or_admin') THEN
    CREATE POLICY gigs_update_owner_or_admin ON public.gigs
      FOR UPDATE
      USING ( owner = auth.uid() OR public.is_admin() )
      WITH CHECK ( owner = auth.uid() OR public.is_admin() );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='gigs' AND policyname='gigs_delete_owner_or_admin') THEN
    CREATE POLICY gigs_delete_owner_or_admin ON public.gigs
      FOR DELETE
      USING ( owner = auth.uid() OR public.is_admin() );
  END IF;
END$$;

-- APPLICATIONS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='applications' AND policyname='apps_select_applicant_owner_admin') THEN
    CREATE POLICY apps_select_applicant_owner_admin ON public.applications
      FOR SELECT
      USING (
        applicant = auth.uid()
        OR EXISTS (SELECT 1 FROM public.gigs g WHERE g.id = applications.gig_id AND g.owner = auth.uid())
        OR public.is_admin()
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='applications' AND policyname='apps_insert_self') THEN
    CREATE POLICY apps_insert_self ON public.applications
      FOR INSERT
      WITH CHECK ( applicant = auth.uid() OR public.is_admin() );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='applications' AND policyname='apps_update_parties_admin') THEN
    CREATE POLICY apps_update_parties_admin ON public.applications
      FOR UPDATE
      USING (
        applicant = auth.uid()
        OR EXISTS (SELECT 1 FROM public.gigs g WHERE g.id = applications.gig_id AND g.owner = auth.uid())
        OR public.is_admin()
      )
      WITH CHECK (
        applicant = auth.uid()
        OR EXISTS (SELECT 1 FROM public.gigs g WHERE g.id = applications.gig_id AND g.owner = auth.uid())
        OR public.is_admin()
      );
  END IF;
END$$;

-- THREADS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='threads' AND policyname='threads_select_parties_admin') THEN
    CREATE POLICY threads_select_parties_admin ON public.threads
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.applications a
          JOIN public.gigs g ON g.id = a.gig_id
          WHERE a.id = threads.application_id
            AND (a.applicant = auth.uid() OR g.owner = auth.uid() OR public.is_admin())
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='threads' AND policyname='threads_insert_owner_or_admin') THEN
    CREATE POLICY threads_insert_owner_or_admin ON public.threads
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.applications a
          JOIN public.gigs g ON g.id = a.gig_id
          WHERE a.id = threads.application_id
            AND (a.applicant = auth.uid() OR g.owner = auth.uid() OR public.is_admin())
        )
      );
  END IF;
END$$;

-- MESSAGES
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='messages' AND policyname='messages_select_parties_admin') THEN
    CREATE POLICY messages_select_parties_admin ON public.messages
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.threads t
          JOIN public.applications a ON a.id = t.application_id
          JOIN public.gigs g ON g.id = a.gig_id
          WHERE t.id = messages.thread_id
            AND (a.applicant = auth.uid() OR g.owner = auth.uid() OR public.is_admin())
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='messages' AND policyname='messages_insert_sender_involved') THEN
    CREATE POLICY messages_insert_sender_involved ON public.messages
      FOR INSERT
      WITH CHECK (
        sender = auth.uid()
        AND EXISTS (
          SELECT 1
          FROM public.threads t
          JOIN public.applications a ON a.id = t.application_id
          JOIN public.gigs g ON g.id = a.gig_id
          WHERE t.id = messages.thread_id
            AND (a.applicant = auth.uid() OR g.owner = auth.uid() OR public.is_admin())
        )
      );
  END IF;
END$$;

-- OFFERS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='offers' AND policyname='offers_select_parties_admin') THEN
    CREATE POLICY offers_select_parties_admin ON public.offers
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.applications a
          JOIN public.gigs g ON g.id = a.gig_id
          WHERE a.id = offers.application_id
            AND (a.applicant = auth.uid() OR g.owner = auth.uid() OR public.is_admin())
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='offers' AND policyname='offers_insert_owner_or_admin') THEN
    CREATE POLICY offers_insert_owner_or_admin ON public.offers
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.applications a
          JOIN public.gigs g ON g.id = a.gig_id
          WHERE a.id = offers.application_id
            AND (g.owner = auth.uid() OR public.is_admin())
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='offers' AND policyname='offers_update_applicant_owner_admin') THEN
    CREATE POLICY offers_update_applicant_owner_admin ON public.offers
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1
          FROM public.applications a
          JOIN public.gigs g ON g.id = a.gig_id
          WHERE a.id = offers.application_id
            AND (a.applicant = auth.uid() OR g.owner = auth.uid() OR public.is_admin())
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.applications a
          JOIN public.gigs g ON g.id = a.gig_id
          WHERE a.id = offers.application_id
            AND (a.applicant = auth.uid() OR g.owner = auth.uid() OR public.is_admin())
        )
      );
  END IF;
END$$;

-- ORDERS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='orders_select_owner_or_admin') THEN
    CREATE POLICY orders_select_owner_or_admin ON public.orders
      FOR SELECT
      USING ( user_id = auth.uid() OR public.is_admin() );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='orders_insert_self') THEN
    CREATE POLICY orders_insert_self ON public.orders
      FOR INSERT
      WITH CHECK ( user_id = auth.uid() OR public.is_admin() );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='orders_update_admin_only') THEN
    CREATE POLICY orders_update_admin_only ON public.orders
      FOR UPDATE
      USING ( public.is_admin() )
      WITH CHECK ( public.is_admin() );
  END IF;
END$$;

-- NOTIFICATIONS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='notifs_select_owner') THEN
    CREATE POLICY notifs_select_owner ON public.notifications
      FOR SELECT
      USING ( user_id = auth.uid() OR public.is_admin() );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='notifs_insert_admin_or_service') THEN
    CREATE POLICY notifs_insert_admin_or_service ON public.notifications
      FOR INSERT
      WITH CHECK ( public.is_admin() OR current_setting('request.jwt.claims', true) IS NULL );
    -- Note: service_role bypasses RLS; this check allows admin inserts in normal sessions.
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='notifs_update_owner') THEN
    CREATE POLICY notifs_update_owner ON public.notifications
      FOR UPDATE
      USING ( user_id = auth.uid() OR public.is_admin() )
      WITH CHECK ( user_id = auth.uid() OR public.is_admin() );
  END IF;
END$$;

COMMIT;

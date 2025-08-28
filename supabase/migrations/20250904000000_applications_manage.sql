-- Applications status constraint and employer controls

-- ensure status check constraint exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'applications_status_check'
  ) THEN
    ALTER TABLE public.applications
      ADD CONSTRAINT applications_status_check
      CHECK (status in ('submitted','withdrawn','declined','accepted'));
  END IF;
END $$;

-- employer may update application status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'employer can update status'
      AND tablename = 'applications'
  ) THEN
    CREATE POLICY "employer can update status"
    ON public.applications
    FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.jobs j
        WHERE j.id = job_id AND j.owner_id = auth.uid()
      )
    )
    WITH CHECK (
      status in ('submitted','withdrawn','declined','accepted')
    );
  END IF;
END $$;

-- ensure jobs has is_closed column
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS is_closed boolean NOT NULL DEFAULT false;

-- employer can close job
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'employer can close job'
      AND tablename = 'jobs'
  ) THEN
    CREATE POLICY "employer can close job"
    ON public.jobs
    FOR UPDATE
    TO authenticated
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());
  END IF;
END $$;

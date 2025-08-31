-- gigs
alter table public.gigs enable row level security;

-- anyone can read published gigs
create policy "gigs: read published"
on public.gigs for select
using (published = true);

-- owners can manage their gigs
create policy "gigs: owner manage"
on public.gigs for all
to authenticated
using (owner = auth.uid())
with check (owner = auth.uid());

-- gig_applications
alter table public.gig_applications enable row level security;

-- applicants can insert their own application
create policy "apps: applicant insert"
on public.gig_applications for insert
to authenticated
with check (applicant = auth.uid());

-- read: applicant sees own, owners see apps to their gigs
create policy "apps: read applicant or owner"
on public.gig_applications for select
to authenticated
using (
  applicant = auth.uid()
  OR exists (
    select 1 from public.gigs g
    where g.id = gig_applications.gig_id and g.owner = auth.uid()
  )
);

-- one application per user per gig
create unique index if not exists uq_app_unique
on public.gig_applications (gig_id, applicant);

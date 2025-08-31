alter table public.gigs alter column status set default 'open';
alter table public.gigs alter column published set default true;
create index if not exists gigs_created_at_idx on public.gigs (created_at desc);
create index if not exists gig_apps_applicant_idx on public.gig_applications (applicant);

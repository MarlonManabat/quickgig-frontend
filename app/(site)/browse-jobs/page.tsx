import { Metadata } from 'next';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

import { JobCard } from '@/components/jobs/job-card';
import { JobFilters } from '@/components/jobs/job-filters';
import { Button } from '@/components/ui/button';
import { listJobs } from '@/lib/jobs';

export const metadata: Metadata = {
  title: 'Browse Jobs • QuickGig.ph',
};

export default async function BrowseJobsPage({ searchParams }: { searchParams: { region?: string; city?: string; posted?: string } }) {
  const jobs = await listJobs({
    region: searchParams.region,
    city: searchParams.city,
  });

  const showSuccess = searchParams.posted === '1';

  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-xl bg-secondary/40 p-6 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Simulan na</p>
          <h1 className="text-3xl font-bold md:text-4xl">Maghanap ng Trabaho na swak sa iyong oras</h1>
          <p className="text-muted-foreground">
            QuickGig.ph ang iyong kasangga sa paghahanap ng flexible na trabaho at pag-post ng gigs sa buong Pilipinas.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="/browse-jobs" data-testid="cta-browse-jobs">
                Maghanap ng Trabaho
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="/gigs/create" data-testid="cta-post-job">
                Mag-post ng Gig
              </a>
            </Button>
          </div>
        </div>
        <div className="hidden h-full flex-col justify-center rounded-lg border border-dashed border-primary/40 bg-primary/5 p-6 md:flex">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Para sa mga employer</p>
          <p className="text-lg font-semibold">May bagong gig idea?</p>
          <p className="text-muted-foreground">I-post agad para mahanap ang iyong susunod na QuickGiger.</p>
        </div>
      </section>

      {showSuccess ? (
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-primary">
          🎉 Matagumpay mong na-post ang iyong gig! Makikita ito sa listahan sa ibaba.
        </div>
      ) : null}

      <Suspense fallback={<div>Loading filters…</div>}>
        <JobFilters />
      </Suspense>

      {jobs.length > 0 ? (
        <div data-testid="jobs-list" className="grid gap-6 md:grid-cols-2">
          {jobs.map((job, index) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <JobCard job={job} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div data-testid="jobs-empty" className="rounded-xl border border-dashed border-muted-foreground/40 p-10 text-center">
          <p className="text-lg font-semibold">Walang nakitang gigs sa kasalukuyan.</p>
          <p className="mt-2 text-muted-foreground">Subukan magbago ng filters o bumalik mamaya.</p>
          <Button className="mt-4" asChild>
            <a href="/browse-jobs" data-testid="browse-jobs-from-empty">
              I-clear ang filters
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

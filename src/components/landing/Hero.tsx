"use client";

import Link from 'next/link';
import { track } from '@/lib/analytics';
import { ROUTES } from '@/lib/routes';

export default function LandingHero() {
  return (
    <section className="...">
      <div className="flex gap-3">
        <Link
          href={ROUTES.browseJobs}
          data-testid="hero-start"
          data-cta="hero-start"
          className="px-4 py-2 rounded-md bg-gray-100"
          onClick={() => track('cta_click', { cta: 'hero-start' })}
        >
          Browse jobs
        </Link>
        <Link
          href={ROUTES.postJob}
          data-testid="hero-post-job"
          data-cta="hero-post-job"
          className="px-4 py-2 rounded-md bg-gray-100"
          onClick={() => track('cta_click', { cta: 'hero-post-job' })}
        >
          Post a job
        </Link>
        <Link
          href={ROUTES.applications}
          data-testid="hero-applications"
          data-cta="hero-applications"
          className="px-4 py-2 rounded-md bg-gray-100"
          onClick={() => track('cta_click', { cta: 'hero-applications' })}
        >
          My applications
        </Link>
      </div>
    </section>
  );
}

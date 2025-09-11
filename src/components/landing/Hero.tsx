"use client";

import Link from 'next/link';
import { track } from '@/lib/analytics';
import { ROUTES, toAppPath } from '@/lib/routes';
import { loginNext } from '@/app/lib/authAware';

export default function LandingHero() {
  return (
    <section className="...">
      <div className="flex gap-3">
        <Link
          href={toAppPath(ROUTES.browseJobs)}
          data-testid="hero-start"
          data-cta="hero-start"
          className="px-4 py-2 rounded-md bg-gray-100"
          onClick={() => track('cta_click', { cta: 'hero-start' })}
        >
          Browse jobs
        </Link>
        <Link
          href={toAppPath(ROUTES.postJobs)}
          data-testid="hero-cta-post-job"
          data-cta="hero-cta-post-job"
          className="px-4 py-2 rounded-md bg-gray-100"
          onClick={() => track('cta_click', { cta: 'hero-cta-post-job' })}
        >
          Post a job
        </Link>
        <Link
          href={toAppPath(ROUTES.signup)}
          data-testid="hero-signup"
          data-cta="hero-signup"
          className="px-4 py-2 rounded-md bg-gray-100"
          onClick={() => track('cta_click', { cta: 'hero-signup' })}
        >
          Sign up
        </Link>
      </div>
    </section>
  );
}

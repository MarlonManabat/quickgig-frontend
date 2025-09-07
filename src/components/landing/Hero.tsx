"use client";

import Link from 'next/link';
import { CTA_TARGET } from '@/lib/navMap';
import { track } from '@/lib/analytics';

export default function LandingHero() {
  return (
    <section className="...">
      <div className="flex gap-3">
        <Link
          href={CTA_TARGET['hero-browse-jobs']}
          data-testid="hero-browse-jobs"
          data-cta="hero-browse-jobs"
          className="px-4 py-2 rounded-md bg-gray-100"
          onClick={() => track('cta_click', { cta: 'hero-browse-jobs' })}
        >
          Browse jobs
        </Link>
        <Link
          href={CTA_TARGET['hero-post-job']}
          data-testid="hero-post-job"
          data-cta="hero-post-job"
          className="px-4 py-2 rounded-md bg-blue-600 text-white"
          onClick={() => track('cta_click', { cta: 'hero-post-job' })}
        >
          Post a job
        </Link>
      </div>
    </section>
  );
}

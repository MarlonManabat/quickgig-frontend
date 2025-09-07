"use client";

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { CTA_TARGET } from '@/lib/navMap';
import { track } from '@/lib/analytics';

export default function LandingHeader() {
  return (
    <nav className="...">
        <Link
          data-testid="nav-browse-jobs"
          data-cta="nav-browse-jobs"
          href={CTA_TARGET['nav-browse-jobs']}
          className="hover:underline"
          onClick={() => track('cta_click', { cta: 'nav-browse-jobs' })}
        >
          Browse jobs
        </Link>
        <Link
          data-testid="nav-post-job"
          data-cta="nav-post-job"
          href={CTA_TARGET['nav-post-job']}
          className="btn btn-primary"
          onClick={() => track('cta_click', { cta: 'nav-post-job' })}
        >
          Post a job
        </Link>
        <Link
          data-testid="nav-my-applications"
          data-cta="nav-my-applications"
          href={CTA_TARGET['nav-my-applications']}
          className="..."
          onClick={() => track('cta_click', { cta: 'nav-my-applications' })}
        >
          My Applications
        </Link>
      <Link data-testid="nav-login" data-cta="nav-login" href={ROUTES.login} className="...">
        Sign in
      </Link>
      <button type="button" data-testid="nav-menu-button" aria-label="Open menu" className="md:hidden">
        Menu
      </button>
    </nav>
  );
}

"use client";

import Link from 'next/link';
import { ROUTES, toAppPath } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { loginNext } from '@/app/lib/authAware';

export default function LandingHeader() {
  return (
    <nav className="...">
      <div id="nav-menu" data-testid="nav-menu">
        <Link
          data-testid="nav-browse-jobs"
          data-cta="nav-browse-jobs"
          href={toAppPath(ROUTES.browseJobs)}
          className="hover:underline"
          onClick={() => track('cta_click', { cta: 'nav-browse-jobs' })}
        >
          Browse jobs
        </Link>
        <Link
          data-testid="nav-post-job"
          data-cta="nav-post-job"
          href={toAppPath(loginNext(ROUTES.postJob))}
          className="btn btn-primary"
          onClick={() => track('cta_click', { cta: 'nav-post-job' })}
        >
          Post a job
        </Link>
        <Link
          data-testid="nav-my-applications"
          data-cta="nav-my-applications"
          href={toAppPath(loginNext(ROUTES.applications))}
          className="..."
          onClick={() => track('cta_click', { cta: 'nav-my-applications' })}
        >
          My Applications
        </Link>
        <Link
          data-testid="nav-tickets"
          data-cta="nav-tickets"
          href={toAppPath(loginNext(ROUTES.tickets))}
          className="..."
          onClick={() => track('cta_click', { cta: 'nav-tickets' })}
        >
          Tickets
        </Link>
        <Link
          data-testid="nav-login"
          data-cta="nav-login"
          href={toAppPath(loginNext(ROUTES.browseJobs))}
          className="..."
        >
          Login
        </Link>
      </div>
      <button type="button" data-testid="nav-menu-button" aria-label="Open menu" className="md:hidden">
        Menu
      </button>
    </nav>
  );
}

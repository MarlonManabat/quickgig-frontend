"use client";

import Link from 'next/link';
import { ROUTES, toAppPath } from '@/lib/routes';
import { track } from '@/lib/analytics';

export default function LandingHeader() {
  return (
    <nav className="...">
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
          href={toAppPath(ROUTES.postJob)}
          className="btn btn-primary"
          onClick={() => track('cta_click', { cta: 'nav-post-job' })}
        >
          Post a job
        </Link>
        <Link
          data-testid="nav-my-applications"
          data-cta="nav-my-applications"
          href={toAppPath(ROUTES.applications)}
          className="..."
          onClick={() => track('cta_click', { cta: 'nav-my-applications' })}
        >
          My Applications
        </Link>
        <Link
          data-testid="nav-tickets"
          data-cta="nav-tickets"
          href={toAppPath(ROUTES.tickets)}
          className="..."
          onClick={() => track('cta_click', { cta: 'nav-tickets' })}
        >
          Tickets
        </Link>
        <Link
          data-testid="nav-buy-ticket"
          data-cta="nav-buy-ticket"
          href={toAppPath(ROUTES.ticketsBuy)}
          className="..."
          onClick={() => track('cta_click', { cta: 'nav-buy-ticket' })}
        >
          Buy ticket
        </Link>
        <Link
          data-testid="nav-login"
          data-cta="nav-login"
          href={toAppPath(ROUTES.login)}
          className="..."
        >
          Login
        </Link>
        <Link
          data-testid="nav-signup"
          data-cta="nav-signup"
          href={toAppPath(ROUTES.signup)}
          className="..."
        >
          Sign up
        </Link>
      <button type="button" data-testid="nav-menu-button" aria-label="Open menu" className="md:hidden">
        Menu
      </button>
    </nav>
  );
}

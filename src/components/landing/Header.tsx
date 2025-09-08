"use client";

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { loginNext } from '@/app/lib/authAware';

export default function LandingHeader() {
  return (
    <nav className="...">
        <Link
          data-testid="nav-browse-jobs"
          data-cta="nav-browse-jobs"
          href={ROUTES.browseJobs}
          className="hover:underline"
          onClick={() => track('cta_click', { cta: 'nav-browse-jobs' })}
        >
          Browse jobs
        </Link>
        <Link
          data-testid="nav-post-job"
          data-cta="nav-post-job"
          href={loginNext(ROUTES.postJob)}
          className="btn btn-primary"
          onClick={() => track('cta_click', { cta: 'nav-post-job' })}
        >
          Post a job
        </Link>
        <Link
          data-testid="nav-my-applications"
          data-cta="nav-my-applications"
          href={loginNext(ROUTES.applications)}
          className="..."
          onClick={() => track('cta_click', { cta: 'nav-my-applications' })}
        >
          My Applications
        </Link>
        <Link
          data-testid="nav-tickets"
          data-cta="nav-tickets"
          href={loginNext(ROUTES.tickets)}
          className="..."
          onClick={() => track('cta_click', { cta: 'nav-tickets' })}
        >
          Tickets
        </Link>
        <Link
          data-testid="nav-buy-ticket"
          data-cta="nav-buy-ticket"
          href={loginNext(ROUTES.ticketsBuy)}
          className="..."
          onClick={() => track('cta_click', { cta: 'nav-buy-ticket' })}
        >
          Buy ticket
        </Link>
        <Link data-testid="nav-login" data-cta="nav-login" href={ROUTES.login} className="...">
          Login
        </Link>
        <Link data-testid="nav-signup" data-cta="nav-signup" href={ROUTES.signup} className="...">
          Sign up
        </Link>
      <button type="button" data-testid="nav-menu-button" aria-label="Open menu" className="md:hidden">
        Menu
      </button>
    </nav>
  );
}

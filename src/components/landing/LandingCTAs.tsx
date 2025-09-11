"use client";

import React from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import { ROUTES, toAppPath } from '@/lib/routes';
import { loginNext } from '@/app/lib/authAware';

type Props = {
  browseClassName?: string;
  postClassName?: string;
  appsClassName?: string;
  signupClassName?: string;
  showBrowse?: boolean;
  showPost?: boolean;
  showApps?: boolean;
  showSignup?: boolean;
};

export default function LandingCTAs({
  browseClassName = '',
  postClassName = '',
  appsClassName = '',
  signupClassName = '',
  showBrowse = true,
  showPost = true,
  showApps = false,
  showSignup = false,
}: Props) {
  return (
    <div className="flex gap-3">
      {showBrowse && (
        <Link
          data-testid="hero-start"
          data-cta="hero-start"
          href={toAppPath(ROUTES.browseJobs)}
          className={browseClassName}
          onClick={() => track('cta_click', { cta: 'hero-start' })}
        >
          Browse jobs
        </Link>
      )}
      {showPost && (
        <Link
          data-testid="hero-cta-post-job"
          data-cta="hero-cta-post-job"
          href={toAppPath(loginNext(ROUTES.postJob))}
          className={postClassName}
          onClick={() => track('cta_click', { cta: 'hero-cta-post-job' })}
        >
          Post a job
        </Link>
      )}
      {showApps && (
        <Link
          data-testid="hero-cta-my-applications"
          data-cta="hero-cta-my-applications"
          href={toAppPath(loginNext(ROUTES.applications))}
          className={appsClassName}
          onClick={() => track('cta_click', { cta: 'hero-cta-my-applications' })}
        >
          My Applications
        </Link>
      )}
      {showSignup && (
        <Link
          data-testid="hero-signup"
          data-cta="hero-signup"
          href={toAppPath(ROUTES.signup)}
          className={signupClassName}
          onClick={() => track('cta_click', { cta: 'hero-signup' })}
        >
          Sign up
        </Link>
      )}
    </div>
  );
}


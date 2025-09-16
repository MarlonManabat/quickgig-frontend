"use client";

import React from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import { ROUTES } from '@/lib/routes';
import { authAware } from '@/lib/hostAware';

type Props = {
  browseClassName?: string;
  postClassName?: string;
  signupClassName?: string;
  showBrowse?: boolean;
  showPost?: boolean;
  showSignup?: boolean;
};

export default function LandingCTAs({
  browseClassName = '',
  postClassName = '',
  signupClassName = '',
  showBrowse = true,
  showPost = true,
  showSignup = false,
}: Props) {
  return (
    <div className="flex gap-3">
      {showBrowse && (
        <Link
          data-testid="hero-start"
          data-cta="hero-start"
          href={ROUTES.browseJobs}
          className={browseClassName}
          onClick={() => track('cta_click', { cta: 'hero-start' })}
        >
          Browse jobs
        </Link>
      )}
      {showPost && (
        <Link
          data-testid="hero-post-job"
          data-cta="hero-post-job"
          href={authAware(ROUTES.postJob)}
          rel="noopener"
          className={postClassName}
          onClick={() => track('cta_click', { cta: 'hero-post-job' })}
        >
          Post a job
        </Link>
      )}
      {showSignup && (
        <Link
          data-testid="hero-applications"
          data-cta="hero-applications"
          href={ROUTES.applications}
          className={signupClassName}
          onClick={() => track('cta_click', { cta: 'hero-applications' })}
        >
          My applications
        </Link>
      )}
    </div>
  );
}


"use client";

import React from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import { ROUTES, toAppPath } from '@/lib/routes';
import { loginNext } from '@/app/lib/authAware';

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
          href={toAppPath(ROUTES.postJob)}
          className={postClassName}
          onClick={() => track('cta_click', { cta: 'hero-cta-post-job' })}
        >
          Post a job
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


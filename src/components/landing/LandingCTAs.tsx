"use client";

import React from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import { ROUTES } from '@/lib/routes';

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
          data-testid="hero-post"
          data-cta="hero-post"
          href={ROUTES.postJob}
          className={postClassName}
          onClick={() => track('cta_click', { cta: 'hero-post' })}
        >
          Post a job
        </Link>
      )}
      {showSignup && (
        <Link
          data-testid="hero-signup"
          data-cta="hero-signup"
          href={ROUTES.signup}
          className={signupClassName}
          onClick={() => track('cta_click', { cta: 'hero-signup' })}
        >
          Sign up
        </Link>
      )}
    </div>
  );
}


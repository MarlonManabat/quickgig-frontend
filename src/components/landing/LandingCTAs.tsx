"use client";

import React from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import { ROUTES } from '@/lib/routes';
import { loginNext } from '@/app/lib/authAware';

type Props = {
  startClassName?: string;
  postClassName?: string;
  showStart?: boolean;
  showPost?: boolean;
};

export default function LandingCTAs({
  startClassName = "",
  postClassName = "",
  showStart = true,
  showPost = true,
}: Props) {
  return (
      <div className="flex gap-3">
          {showStart && (
            <Link
              data-testid="hero-start"
              data-cta="hero-start"
              href={ROUTES.browseJobs}
              className={startClassName}
              onClick={() => track('cta_click', { cta: 'hero-start' })}
            >
              Browse jobs
            </Link>
          )}
          {showPost && (
            <Link
              data-testid="hero-post-job"
              data-cta="hero-post-job"
              href={loginNext(ROUTES.postJob)}
              className={postClassName}
              onClick={() => track('cta_click', { cta: 'hero-post-job' })}
            >
              Post a job
            </Link>
          )}
      </div>
    );
  }


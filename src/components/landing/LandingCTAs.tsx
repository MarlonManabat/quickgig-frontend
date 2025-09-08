"use client";

import React from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import { ROUTES, toAppPath } from '@/lib/routes';

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
              href={toAppPath(ROUTES.postJob)}
              className={startClassName}
              onClick={() => track('cta_click', { cta: 'hero-start' })}
            >
              Simulan na
            </Link>
          )}
          {showPost && (
            <Link
              data-testid="hero-browse"
              data-cta="hero-browse"
              href={toAppPath(ROUTES.browseJobs)}
              className={postClassName}
              onClick={() => track('cta_click', { cta: 'hero-browse' })}
            >
              Browse jobs
            </Link>
          )}
      </div>
    );
  }


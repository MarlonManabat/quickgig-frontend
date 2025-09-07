import React from 'react';
import Link from 'next/link';
import { CTA_TARGET } from '@/lib/navMap';

type Props = {
  findClassName?: string;
  postClassName?: string;
  showFind?: boolean;
  showPost?: boolean;
};

export default function LandingCTAs({
  findClassName = "",
  postClassName = "",
  showFind = true,
  showPost = true,
}: Props) {
  return (
      <div className="flex gap-3">
        {showFind && (
          <Link
            data-testid="hero-browse-jobs"
            data-cta="hero-browse-jobs"
            href={CTA_TARGET['hero-browse-jobs']}
            className={findClassName}
          >
            Browse jobs
          </Link>
        )}
        {showPost && (
          <Link
            data-testid="hero-post-job"
            data-cta="hero-post-job"
            href={CTA_TARGET['hero-post-job']}
            className={postClassName}
          >
            Post a job
          </Link>
        )}
      </div>
    );
  }


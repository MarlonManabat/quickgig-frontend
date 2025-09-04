import React from 'react';
import { toAppPath } from '@/lib/urls';
import { ROUTES } from '@/app/lib/routes';

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
          <a
            data-testid="cta-browse-jobs"
            href={toAppPath(ROUTES.GIGS_BROWSE)}
            className={findClassName}
            rel="noopener noreferrer"
          >
            Browse jobs
          </a>
        )}
        {showPost && (
          <a
            data-testid="cta-post-job"
            href={toAppPath(ROUTES.GIGS_CREATE)}
            className={postClassName}
            rel="noopener noreferrer"
          >
            Post a job
          </a>
        )}
      </div>
    );
  }


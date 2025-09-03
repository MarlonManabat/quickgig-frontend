import React from 'react';
import { toAppPath } from '@/lib/urls';

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
              data-testid="find-work-link"
              href={toAppPath('/browse-jobs')}
              className={findClassName}
              rel="noopener noreferrer"
            >
            Browse jobs
          </a>
        )}
        {showPost && (
            <a
              data-testid="post-job-link"
              href={toAppPath('/gigs/create')}
              className={postClassName}
              rel="noopener noreferrer"
            >
            Post a job
          </a>
        )}
      </div>
    );
  }


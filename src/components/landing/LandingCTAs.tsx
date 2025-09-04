import React from 'react';
import LinkApp from '@/components/LinkApp';
import { ROUTES } from '@/lib/routes';

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
          <LinkApp
            data-testid="cta-browse-jobs"
            href={ROUTES.browseJobs}
            className={findClassName}
          >
            Browse jobs
          </LinkApp>
        )}
        {showPost && (
          <LinkApp href={ROUTES.postJob} className={postClassName}>
            Post a job
          </LinkApp>
        )}
      </div>
    );
  }


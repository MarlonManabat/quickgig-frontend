import React from "react";
import Link from 'next/link';

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
            data-testid="find-work-link"
            href="/gigs"
            className={findClassName}
          >
            Find Work
          </Link>
        )}
        {showPost && (
          <Link
            data-testid="post-job-link"
            href="/gigs/create"
            className={postClassName}
          >
            Post Job
          </Link>
        )}
      </div>
    );
  }


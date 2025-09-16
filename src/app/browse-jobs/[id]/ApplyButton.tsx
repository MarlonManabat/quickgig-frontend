'use client';

import { trackApply } from '@/lib/track';

type ApplyButtonProps = {
  href: string;
  jobId: string | number;
  title?: string;
};

export function ApplyButton({ href, jobId, title }: ApplyButtonProps) {
  return (
    <a
      data-testid="apply-button"
      data-analytics="apply-click"
      href={href}
      className="mt-6 inline-block rounded bg-blue-500 px-4 py-2 text-white"
      rel="noopener"
      onClick={() => trackApply({ id: jobId, title })}
    >
      Apply
    </a>
  );
}

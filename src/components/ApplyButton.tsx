'use client';

import * as React from 'react';

type Props = {
  href: string;
  jobId?: string | number;
  title?: string;
  disabled?: boolean;
  className?: string;
  ['data-testid']?: string;
};

export default function ApplyButton({
  href,
  jobId,
  title,
  disabled,
  className,
  ...rest
}: Props) {
  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      const headers = { 'content-type': 'application/json' } as const;

      try {
        if (jobId !== undefined) {
          void fetch('/api/applications/record', {
            method: 'POST',
            keepalive: true,
            headers,
            body: JSON.stringify({ jobId }),
          });
        }

        void fetch('/api/track/apply', {
          method: 'POST',
          keepalive: true,
          headers,
          body: JSON.stringify({ jobId, title, href }),
        });
      } catch {
        // Best-effort tracking; navigation should proceed regardless.
      }
    },
    [disabled, href, jobId, title],
  );

  return (
    <a
      href={href}
      onClick={onClick}
      data-testid="apply-button"
      aria-disabled={disabled ? 'true' : undefined}
      className={
        `inline-block rounded bg-blue-500 px-4 py-2 text-white` +
        (disabled ? ' opacity-50 pointer-events-none' : '') +
        (className ? ` ${className}` : '')
      }
      {...rest}
    >
      Apply
    </a>
  );
}

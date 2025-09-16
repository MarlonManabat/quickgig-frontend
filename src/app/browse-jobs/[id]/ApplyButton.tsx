'use client';

import { useCallback, useState } from 'react';

type ApplyButtonProps = {
  href: string;
  jobId: string | number;
  title?: string;
};

export function ApplyButton({ href, jobId, title }: ApplyButtonProps) {
  const [busy, setBusy] = useState(false);

  const onClick = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      await Promise.allSettled([
        fetch('/api/applications/record', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jobId }),
        }),
        fetch('/api/track/apply', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jobId, title, href }),
        }),
      ]);
    } catch {}
    window.location.href = href;
  }, [busy, href, jobId, title]);

  return (
    <button
      type="button"
      data-testid="apply-button"
      className="mt-6 inline-block rounded bg-blue-500 px-4 py-2 text-white"
      onClick={onClick}
      aria-disabled={busy}
    >
      {busy ? 'Opening…' : 'Apply'}
    </button>
  );
}

'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

const showBadge = process.env.NEXT_PUBLIC_SHOW_API_BADGE === 'true';

export default function ApiBadge() {
  type Status = 'ok' | 'degraded' | 'error';
  const [status, setStatus] = useState<Status>('degraded');

  async function check() {
    try {
      const res = await fetch('/api/health', { credentials: 'same-origin' });
      const data = await res.json();
      if (data.ok && data.services?.app === 'up') {
        setStatus('ok');
      } else if (data.ok) {
        setStatus('degraded');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    if (!showBadge) return;
    check();
    const id = setInterval(check, 20000);
    return () => clearInterval(id);
  }, []);

  if (!showBadge) return null;

  const color =
    status === 'ok'
      ? 'bg-green-500 text-white'
      : status === 'degraded'
      ? 'bg-yellow-400 text-black'
      : 'bg-red-500 text-white';

  const label =
    status === 'ok'
      ? 'API: OK'
      : status === 'degraded'
      ? 'API: DEGRADED'
      : 'API: ERROR';

  return (
    <span
      className={clsx(
        'api-badge inline-block w-24 rounded px-2 py-1 text-center text-xs font-medium',
        color,
      )}
      role="status"
      aria-live="polite"
    >
      {label}
    </span>
  );
}

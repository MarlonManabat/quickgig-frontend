'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { fetchSession } from '@/lib/session';

const showBadge = process.env.NEXT_PUBLIC_SHOW_API_BADGE === 'true';

export default function ApiBadge() {
  type Status = 'ok' | 'error' | 'hidden';
  const [status, setStatus] = useState<Status>('hidden');

  async function check() {
    const res = await fetchSession();
    if (res.status === 200) setStatus('ok');
    else if (res.status === 401) setStatus('hidden');
    else setStatus('error');
  }

  useEffect(() => {
    if (!showBadge) return;
    check();
    const id = setInterval(check, 20000);
    return () => clearInterval(id);
  }, []);

  if (!showBadge || status === 'hidden') return null;

  const color = status === 'ok' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
  const label = status === 'ok' ? 'API: OK' : 'API: ERROR';

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

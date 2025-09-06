'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then(r => r.json());

export default function TicketBalanceChip() {
  const { data } = useSWR<{ balance?: number; ok?: boolean }>('/api/tickets/balance', fetcher, { refreshInterval: 30_000 });

  const b = typeof data?.balance === 'number' ? data.balance : undefined;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
      🎟️ <strong>{b ?? '—'}</strong>
    </span>
  );
}

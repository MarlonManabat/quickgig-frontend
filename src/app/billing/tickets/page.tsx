import TicketsClient from '@/features/billing/TicketsClient';
import { redirect } from 'next/navigation';
import { userIdFromCookie } from '@/lib/supabase/server';
import { getTicketBalance } from '@/lib/tickets';

export const dynamic = 'force-dynamic';

function safeNextParam(raw?: string) {
  if (!raw) return null;
  try {
    if (raw.startsWith('/')) return raw;
  } catch {}
  return null;
}

export default async function TicketsPage({ searchParams }: { searchParams: { next?: string } }) {
  const uid = await userIdFromCookie();
  if (!uid) redirect('/login?next=/billing/tickets');

  const balance = await getTicketBalance(uid);
  const next = safeNextParam(searchParams?.next);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Buy Tickets</h1>
      <TicketsClient initialBalance={balance} next={next} />
    </div>
  );
}


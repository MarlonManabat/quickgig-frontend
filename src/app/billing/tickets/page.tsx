import TicketsClient from '@/features/billing/TicketsClient';
import { redirect } from 'next/navigation';
import { userIdFromCookie } from '@/lib/supabase/server';
import { getTicketBalance } from '@/lib/tickets';
import { safeNext } from '@/lib/safe-next';

export const dynamic = 'force-dynamic';

export default async function TicketsPage({ searchParams }: { searchParams: { next?: string } }) {
  const uid = await userIdFromCookie();
  if (!uid) redirect('/login?next=/billing/tickets');

  const balance = await getTicketBalance(uid);
  const next = safeNext(searchParams?.next);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Buy Tickets</h1>
      <TicketsClient initialBalance={balance} next={next} />
    </div>
  );
}


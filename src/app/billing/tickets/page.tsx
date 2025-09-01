import { redirect } from 'next/navigation';
import TicketsClient from '@/features/billing/TicketsClient';
import { userIdFromCookie } from '@/lib/supabase/server';
import { getTicketBalance } from '@/lib/tickets';

export const dynamic = 'force-dynamic';

export default async function TicketsPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const uid = await userIdFromCookie();
  if (!uid) redirect('/login?next=/billing/tickets');
  const bal = await getTicketBalance(uid);
  const next = searchParams?.next ?? null;
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Buy Tickets</h1>
      <TicketsClient balance={bal} next={next} />
    </div>
  );
}


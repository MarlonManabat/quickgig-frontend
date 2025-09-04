// Server Component
import { redirect } from 'next/navigation';
import PostJobFormClient from '@/features/gigs/PostJobFormClient';
import { userIdFromCookie } from '@/lib/supabase/server';
import { ensureTicketsRow, getTicketBalance } from '@/lib/tickets';
import { ROUTES } from '@/lib/routes';

export const dynamic = 'force-dynamic';

export default async function GigsCreatePage() {
  const uid = await userIdFromCookie();
  if (!uid) redirect(`${ROUTES.login}?next=${ROUTES.gigsCreate}`);
  await ensureTicketsRow(uid);
  const balance = await getTicketBalance(uid);
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Post a Job</h1>
      <PostJobFormClient balance={balance} />
    </div>
  );
}

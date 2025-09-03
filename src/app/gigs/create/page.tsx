// Server Component
import { redirect } from 'next/navigation';
import PostJobFormClient from '@/features/gigs/PostJobFormClient';
import { userIdFromCookie } from '@/lib/supabase/server';
import { ensureTicketsRow, getTicketBalance } from '@/lib/tickets';

export const dynamic = 'force-dynamic';

export default async function GigsCreatePage() {
  const uid = await userIdFromCookie();
  if (!uid) redirect('/login?next=/gigs/create');
  await ensureTicketsRow(uid);
  const balance = await getTicketBalance(uid);
  return (
    <div className="mx-auto max-w-screen-md px-4 sm:px-6 py-6">
      <h1 className="mb-3 text-xl font-semibold">Post a Job</h1>
      <PostJobFormClient balance={balance} />
    </div>
  );
}

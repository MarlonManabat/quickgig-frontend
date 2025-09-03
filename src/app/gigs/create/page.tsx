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
    <main className="container mx-auto max-w-full sm:max-w-screen-lg px-4 py-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-3">Post a Job</h1>
      <PostJobFormClient balance={balance} />
    </main>
  );
}

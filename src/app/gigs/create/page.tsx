// Server Component
import { redirect } from 'next/navigation';
import PostJobFormClient from '@/features/gigs/PostJobFormClient';
import { userIdFromCookie } from '@/lib/supabase/server';
import { ensureTickets } from '@/lib/tickets';

export const dynamic = 'force-dynamic';

export default async function GigsCreatePage() {
  const uid = await userIdFromCookie();
  if (!uid) redirect('/login?next=/gigs/create');
  const ok = await ensureTickets(uid);
  if (!ok) redirect('/billing/tickets?next=/gigs/create');
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Post a Job</h1>
      <PostJobFormClient />
    </div>
  );
}

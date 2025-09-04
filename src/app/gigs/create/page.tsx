// Server Component
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import PostJobForm from '@/components/post-job/PostJobForm';
import PostJobSkeleton from '@/components/post-job/PostJobSkeleton';
import PostJobErrorBoundary from '@/components/PostJobErrorBoundary';
import { userIdFromCookie } from '@/lib/supabase/server';
import { ensureTicketsRow, getTicketBalance } from '@/lib/tickets';

export const dynamic = 'force-dynamic';

export default async function GigsCreatePage() {
  const uid = await userIdFromCookie();
  if (!uid) redirect('/login?next=/gigs/create');
  await ensureTicketsRow(uid);
  const balance = await getTicketBalance(uid);
  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-4 text-base">
      <h1 className="text-xl font-semibold">Post a Job</h1>
      <Suspense fallback={<PostJobSkeleton />}>
        <PostJobErrorBoundary>
          <PostJobForm balance={balance} />
        </PostJobErrorBoundary>
      </Suspense>
    </div>
  );
}

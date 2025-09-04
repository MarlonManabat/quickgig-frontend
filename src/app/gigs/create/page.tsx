// Server Component
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import PostJobFormClient from '@/features/gigs/PostJobFormClient';
import { userIdFromCookie } from '@/lib/supabase/server';
import { ensureTicketsRow, getTicketBalance } from '@/lib/tickets';
import PostJobErrorBoundary from '@/components/post-job/PostJobErrorBoundary';
import PostJobSkeleton from '@/components/post-job/PostJobSkeleton';

export const dynamic = 'force-dynamic';

export default async function GigsCreatePage() {
  const uid = await userIdFromCookie();
  if (!uid) redirect('/login?next=/gigs/create');
  await ensureTicketsRow(uid);
  const balance = await getTicketBalance(uid);
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Post a Job</h1>
      <Suspense fallback={<PostJobSkeleton data-testid="post-job-skeleton" />}>
        <PostJobErrorBoundary>
          <PostJobFormClient balance={balance} />
        </PostJobErrorBoundary>
      </Suspense>
    </div>
  );
}

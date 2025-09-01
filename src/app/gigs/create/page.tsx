// Server Component
import PostJobFormClient from '@/features/gigs/PostJobFormClient';
export const dynamic = 'force-dynamic';

export default async function GigsCreatePage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Post a Job</h1>
      <PostJobFormClient />
    </div>
  );
}

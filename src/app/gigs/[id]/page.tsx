import GigDetail from '@/components/gigs/GigDetail';
import ApplyPanel from '@/components/gigs/ApplyPanel';
import Empty from '@/components/gigs/Empty';
import { getOrigin } from '@/lib/origin';
import type { GigDetail } from '@/types/gigs';

export const dynamic = 'force-dynamic';

async function fetchGig(id: string): Promise<GigDetail | null> {
  const res = await fetch(`${getOrigin()}/api/gigs/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load gig');
  const data = (await res.json()) as { gig: GigDetail };
  return data.gig;
}

export default async function GigPage({ params }: { params: { id: string } }) {
  const gig = await fetchGig(params.id);
  if (!gig) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Empty />
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <GigDetail gig={gig} />
      <ApplyPanel gigId={params.id} />
    </main>
  );
}

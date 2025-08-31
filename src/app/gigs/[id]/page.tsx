import { notFound } from 'next/navigation';
import ApplyButton from '@/components/ApplyButton';
import type { Gig } from '@/types/db';

export const dynamic = 'force-dynamic';

async function fetchGig(id: string): Promise<Gig | null> {
  const res = await fetch(`/api/gigs/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed');
  return (await res.json()) as Gig;
}

export default async function GigDetail({ params }: { params: { id: string } }) {
  const gig = await fetchGig(params.id);
  if (!gig) return notFound();
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{gig.title}</h1>
      <p className="text-sm text-slate-600">
        {gig.city || 'Anywhere'} · {new Date(gig.created_at).toLocaleDateString()}
      </p>
      <p className="whitespace-pre-wrap">{gig.description}</p>
      <ApplyButton gigId={gig.id} />
    </main>
  );
}

import GigRow from '@/components/owner/GigRow';
import { getOrigin } from '@/lib/origin';
import type { OwnerGigRow } from '@/types/owner';

export const dynamic = 'force-dynamic';

export default async function OwnerGigsPage() {
  const res = await fetch(`${getOrigin()}/api/owner/gigs`, {
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({ items: [] }));
  const items = (data.items as OwnerGigRow[]) || [];
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-xl font-semibold">My Gigs</h1>
      {items.length === 0 ? (
        <p>No gigs found.</p>
      ) : (
        <ul className="divide-y border rounded">
          {items.map((g) => (
            <GigRow key={g.id} gig={g} />
          ))}
        </ul>
      )}
    </main>
  );
}

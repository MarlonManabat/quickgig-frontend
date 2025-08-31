import GigCard from '@/components/GigCard';
import type { Gig } from '@/types/db';

export const dynamic = 'force-dynamic';

async function fetchGigs(params: { q?: string; city?: string }) {
  const qs = new URLSearchParams();
  if (params.q) qs.set('search', params.q);
  if (params.city) qs.set('city', params.city);
  const res = await fetch(`/api/gigs${qs.toString() ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!res.ok) return [] as Gig[];
  const json = await res.json();
  return (json.items as Gig[]) || [];
}

export default async function GigsPage({ searchParams }: { searchParams: { q?: string; city?: string } }) {
  const gigs = await fetchGigs(searchParams);
  return (
    <main className="mx-auto max-w-5xl p-6">
      <form className="mb-4 flex gap-2">
        <input
          type="text"
          name="q"
          placeholder="Search gigs"
          defaultValue={searchParams.q || ''}
          className="flex-1 border rounded p-2"
        />
        <select
          name="city"
          defaultValue={searchParams.city || ''}
          className="border rounded p-2"
        >
          <option value="">All cities</option>
          <option value="Manila">Manila</option>
          <option value="Makati">Makati</option>
          <option value="Cebu">Cebu</option>
        </select>
        <button type="submit" className="border rounded px-4 py-2">Go</button>
      </form>
      <ul className="grid gap-4">
        {gigs.map((g) => (
          <GigCard key={g.id} gig={g} />
        ))}
      </ul>
      {gigs.length === 0 && <p className="text-slate-500">No gigs found.</p>}
    </main>
  );
}

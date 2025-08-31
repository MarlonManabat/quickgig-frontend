import Link from 'next/link';
import { apiUrl } from '@/lib/urls';

export const dynamic = 'force-dynamic';

async function fetchGigs() {
  const res = await fetch(apiUrl('/api/gigs'), { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return json.items ?? [];
}

export default async function GigsPage() {
  const gigs = await fetchGigs();
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Browse gigs</h1>
      <ul className="grid gap-4">
        {gigs.map((g: any) => (
          <li key={g.id} className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">{g.title}</h2>
                <p className="text-sm text-slate-600 line-clamp-2">{g.description}</p>
              </div>
              <Link className="underline" href={`/gigs/${g.id}`}>View</Link>
            </div>
          </li>
        ))}
        {gigs.length === 0 && <p className="text-slate-500">No gigs yet.</p>}
      </ul>
    </main>
  );
}

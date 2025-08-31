import { notFound } from 'next/navigation';
import { apiUrl } from '@/lib/urls';

export const dynamic = 'force-dynamic';

async function fetchGig(id: string) {
  const res = await fetch(apiUrl('/api/gigs'), { cache: 'no-store' });
  if (!res.ok) return null;
  const { items } = await res.json();
  return items.find((g: any) => String(g.id) === id) ?? null;
}

export default async function GigDetail({ params }: { params: { id: string }}) {
  const gig = await fetchGig(params.id);
  if (!gig) return notFound();
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">{gig.title}</h1>
      <p className="mt-2 whitespace-pre-wrap">{gig.description}</p>
      <form action={`/api/applications`} method="post" className="mt-6 grid gap-2">
        <input type="hidden" name="gig_id" value={gig.id} />
        <textarea name="cover_letter" placeholder="Cover letter…" className="border rounded p-2 min-h-[120px]" />
        <button className="rounded bg-black text-white px-4 py-2 w-fit">Apply</button>
      </form>
    </main>
  );
}

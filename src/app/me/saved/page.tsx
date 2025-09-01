export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function fetchSaved() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_ORIGIN ?? ''}/api/saved`, { cache: 'no-store' });
    if (!res.ok) return { items: [], error: await res.text() };
    return (await res.json()) as { ok: boolean; items: string[]; error?: string };
  } catch (e) {
    return { items: [], error: 'network' };
  }
}

export default async function SavedPage() {
  const { items, error } = await fetchSaved();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold mb-4">Saved gigs</h1>
      {error && <p className="text-sm text-red-500 mb-4">Problem loading saved gigs: {error}</p>}
      {items.length === 0 ? (
        <p className="text-slate-600">You haven’t saved any gigs yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((id) => (
            <li key={id} className="rounded border p-3 text-sm">
              gig #{id}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

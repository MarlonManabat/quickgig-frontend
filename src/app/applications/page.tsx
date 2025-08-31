async function fetchMyApps(userId: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_APP_ORIGIN}/api/applications`);
  url.searchParams.set('user', userId);
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return json.items ?? [];
}

export default async function MyApplications() {
  const userId = 'stub-worker';
  const apps = await fetchMyApps(userId);
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold mb-4">My applications</h1>
      <ul className="grid gap-3">
        {apps.map((a: any) => (
          <li key={a.id} className="border rounded p-3">
            Application #{a.id} — Gig #{a.gig_id} — {new Date(a.created_at).toLocaleString()}
          </li>
        ))}
        {apps.length === 0 && <p className="text-slate-500">No applications yet.</p>}
      </ul>
    </main>
  );
}

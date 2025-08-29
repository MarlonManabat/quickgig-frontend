'use client';

import React from 'react';
import LocationSelect from '@/components/LocationSelect';

export default function FindPage() {
  const [region_code, setRegion] = React.useState('');
  const [city_code, setCity]     = React.useState('');
  const [q, setQ] = React.useState('');
  const [items, setItems] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    // TODO: replace with real fetch once gigs exist; keep non-fatal now.
    setItems([]); // safe default so UI never blanks
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4 min-h-[60vh]">
      <h1 className="text-2xl font-semibold">Browse jobs</h1>

      <div className="grid gap-3 sm:grid-cols-3">
        <input
          className="border rounded-xl p-2"
          placeholder="Search keywords"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <LocationSelect
          value={{ region_code, city_code }}
          onChange={(v) => { setRegion(v.region_code || ''); setCity(v.city_code || ''); }}
          className="sm:col-span-2"
        />
      </div>

      {!items || items.length === 0 ? (
        <p className="opacity-70">No gigs yet. Try a different filter or check back soon.</p>
      ) : (
        <ul className="grid gap-3">
          {items.map((g: any) => (
            <li key={g.id} className="border rounded-xl p-3">
              <div className="font-medium">{g.title}</div>
              <div className="text-sm opacity-70">{g.city_name || g.city_code}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

'use client';
import React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/db';
import LocationSelect from '@/components/LocationSelect';

export default function FindPage() {
  const supa = createClientComponentClient<Database>();
  const [q, setQ] = React.useState('');
  const [region_code, setRegion] = React.useState('');
  const [city_code, setCity] = React.useState('');
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    let query = supa.from('gigs')
      .select('id,title,description,region_code,city_code,created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (region_code) query = query.eq('region_code', region_code);
    if (city_code)  query = query.eq('city_code', city_code);
    if (q.trim())   query = query.ilike('title', `%${q}%`);
    const { data, error } = await query;
    setItems(error ? [] : (data ?? []));
    setLoading(false);
  }, [supa, q, region_code, city_code]);

  React.useEffect(() => { load(); }, [load]);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4 min-h-[60vh]">
      <h1 className="text-2xl font-semibold">Browse jobs</h1>

      <div className="grid gap-3 sm:grid-cols-3">
        <input className="border rounded-xl p-2" placeholder="Search keywords"
               value={q} onChange={(e)=>setQ(e.target.value)} />
        <LocationSelect
          value={{ region_code, city_code }}
          onChange={(v)=>{ setRegion(v.region_code || ''); setCity(v.city_code || ''); }}
          className="sm:col-span-2"
        />
      </div>

      <button className="px-3 py-2 rounded-xl border" onClick={load} disabled={loading}>
        {loading ? 'Loading…' : 'Refresh'}
      </button>

      {!items.length ? (
        <p className="opacity-70">No gigs found.</p>
      ) : (
        <ul className="grid gap-3">
          {items.map(g => (
            <li key={g.id} className="border rounded-xl p-3">
              <div className="font-medium">{g.title}</div>
              <div className="text-sm opacity-70">{g.region_code} • {g.city_code}</div>
              <p className="text-sm mt-1 line-clamp-3">{g.description}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { REGIONS_PH, CITIES_BY_REGION } from '@/lib/locationsPH';

export default function FindJobs() {
  const r = useRouter();
  const [region, setRegion] = useState((r.query.region as string) || '');
  const [city, setCity] = useState((r.query.city as string) || '');
  const [isOnline, setIsOnline] = useState(r.query.online === 'true');
  const [jobs, setJobs] = useState<any[]>([]);

  async function load() {
    let q = supabase
      .from('jobs')
      .select('id,title,company,is_online,location_region,location_city,location_address,created_at')
      .order('created_at', { ascending: false });
    if (region) q = q.ilike('location_region', `%${region}%`);
    if (city) q = q.ilike('location_city', `%${city}%`);
    if (isOnline) q = q.eq('is_online', true);
    const { data } = await q;
    setJobs(data ?? []);
  }
  useEffect(() => {
    load();
  }, [region, city, isOnline]);

  return (
    <main className="max-w-6xl mx-auto p-4">
      <form onSubmit={e => e.preventDefault()} className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-2">
        <select className="border rounded p-2" value={region} onChange={e => setRegion(e.target.value)}>
          <option value="">All regions</option>
          {REGIONS_PH.map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className="border rounded p-2"
          value={city}
          onChange={e => setCity(e.target.value)}
          disabled={!region}
        >
          <option value="">{region ? 'All cities' : 'Select region first'}</option>
          {(CITIES_BY_REGION[region] ?? []).map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 border rounded p-2">
          <input type="checkbox" checked={isOnline} onChange={e => setIsOnline(e.target.checked)} />
          Online Jobs only
        </label>
      </form>

      <ul className="space-y-2">
        {jobs.map(j => (
          <li key={j.id} className="border rounded p-3">
            <div className="font-semibold">{j.title}</div>
            <div className="text-sm text-gray-600">
              {j.is_online
                ? 'Online Job'
                : [j.location_city, j.location_region].filter(Boolean).join(', ') +
                  (j.location_address ? ` — ${j.location_address}` : '')}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

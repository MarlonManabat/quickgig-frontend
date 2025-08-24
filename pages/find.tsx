import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  REGIONS,
  getCitiesForRegion,
  type RegionKey,
} from '@/lib/locations/phRegions';

function regionLabelFromKey(key: string | undefined) {
  return REGIONS.find(r => r.key === key)?.label ?? '';
}

function cityLabelFromKey(regionKey: string, cityKey: string) {
  const match = getCitiesForRegion(regionKey as RegionKey).find(
    c => c.value === cityKey,
  );
  return match?.label ?? '';
}

export default function FindJobs() {
  const r = useRouter();
  const [region, setRegion] = useState((r.query.region as string) || '');
  const [city, setCity] = useState((r.query.city as string) || '');
  const [isOnline, setIsOnline] = useState(r.query.online === 'true');
  const [jobs, setJobs] = useState<any[]>([]);

  const ALL_REGIONS = { label: 'All regions', value: '' };
  const ALL_CITIES = { label: 'All cities', value: '' };

  const regionOptions = [
    ALL_REGIONS,
    ...REGIONS.map(r => ({ label: r.label, value: r.key })),
  ];
  const cityOptions = [
    ALL_CITIES,
    ...getCitiesForRegion((region || null) as RegionKey | null).map(c => ({
      label: c.label,
      value: c.value,
    })),
  ];

  async function load() {
    let q = supabase
      .from('jobs')
      .select(
        'id,title,company,is_online,location_region,location_city,location_address,created_at',
      )
      .order('created_at', { ascending: false });
    if (region) q = q.eq('location_region', regionLabelFromKey(region));
    if (region && city)
      q = q.eq('location_city', cityLabelFromKey(region, city));
    if (isOnline) q = q.eq('is_online', true);
    const { data } = await q;
    setJobs(data ?? []);
  }

  useEffect(() => {
    load();
  }, [region, city, isOnline]);

  return (
    <main className="max-w-6xl mx-auto p-4">
      <form
        onSubmit={e => e.preventDefault()}
        className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-2"
      >
        <select
          className="border rounded p-2"
          value={region}
          onChange={e => {
            setRegion(e.target.value);
            setCity('');
          }}
        >
          {regionOptions.map(o => (
            <option key={o.value || 'all'} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className="border rounded p-2"
          value={city}
          onChange={e => setCity(e.target.value)}
          disabled={!region}
        >
          {cityOptions.map(o => (
            <option key={o.value || 'all'} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 border rounded p-2">
          <input
            type="checkbox"
            checked={isOnline}
            onChange={e => setIsOnline(e.target.checked)}
          />
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
                : [j.location_city, j.location_region]
                    .filter(Boolean)
                    .join(', ') +
                  (j.location_address ? ` — ${j.location_address}` : '')}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

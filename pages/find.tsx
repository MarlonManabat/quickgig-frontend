import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getRegions, getCities, RegionOption, CityOption } from '@/lib/locations';

export default function FindJobs() {
  const r = useRouter();
  const [region, setRegion] = useState((r.query.region as string) || '');
  const [city, setCity] = useState((r.query.city as string) || '');
  const [isOnline, setIsOnline] = useState(r.query.online === 'true');
  const [jobs, setJobs] = useState<any[]>([]);
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);

  useEffect(() => {
    getRegions().then(setRegions);
  }, []);

  useEffect(() => {
    if (region) getCities(region).then(setCities);
    else setCities([]);
  }, [region]);

  const regionLabel = regions.find(r => r.value === region)?.label || '';
  const cityLabel = cities.find(c => c.value === city)?.label || '';

  async function load() {
    let q = supabase
      .from('jobs')
      .select('id,title,company,is_online,region,city,address,created_at')
      .order('created_at', { ascending: false });
    if (regionLabel) q = q.eq('region', regionLabel);
    if (regionLabel && cityLabel) q = q.eq('city', cityLabel);
    if (isOnline) q = q.eq('is_online', true);
    const { data } = await q;
    setJobs(data ?? []);
  }

  useEffect(() => {
    load();
  }, [regionLabel, cityLabel, isOnline]);

  const regionOptions = [{ label: 'All regions', value: '' }, ...regions];
  const cityOptions = [{ label: 'All cities', value: '' }, ...cities];

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
                : [j.city, j.region]
                    .filter(Boolean)
                    .join(', ') +
                  (j.address ? ` — ${j.address}` : '')}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

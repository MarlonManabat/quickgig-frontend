import { useState, useEffect } from 'react';
import { getRegions, getCities, RegionOption, CityOption } from '@/lib/locations';
import { createJob } from '@/lib/jobs';
import { requireTicket } from '@/lib/tickets';
import { useRequireUser } from '@/lib/useRequireUser';

export default function PostJobPage() {
  const { ready, userId, timedOut } = useRequireUser();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getRegions().then(setRegions);
  }, []);

  useEffect(() => {
    if (region) getCities(region).then(setCities);
    else setCities([]);
  }, [region]);

  const locationDisabled = isOnline;
  const regionLabel = regions.find(r => r.value === region)?.label || '';
  const cityLabel = cities.find(c => c.value === city)?.label || '';

  async function onSubmit(e: any) {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    try {
      await requireTicket(userId, 'post_job');
      await createJob({
        title: title.trim(),
        company: company.trim() || undefined,
        is_online: isOnline,
        region: locationDisabled ? null : regionLabel || null,
        city: locationDisabled ? null : cityLabel || null,
        address: locationDisabled ? null : address.trim() || null,
      });
      window.location.href = '/find';
    } catch (err: any) {
      if (err.message?.includes('Insufficient tickets')) {
        alert('Kulang ang tickets para mag-post. Tap the bell to contact Support.');
      } else {
        console.error(err);
        alert('Could not post job');
      }
    } finally {
      setBusy(false);
    }
  }

  if (!ready)
    return <p className="p-6">{timedOut ? 'Auth timeout' : 'Loading...'}</p>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Post a Job</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Job title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Company (optional)"
          value={company}
          onChange={e => setCompany(e.target.value)}
        />

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isOnline} onChange={e => setIsOnline(e.target.checked)} />
          Online Job
          <span
            className="text-xs text-gray-500"
            title="Online Job = work-from-anywhere; hindi kailangan ng exact address."
          >
            ⓘ
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            className="border rounded p-2"
            value={region}
            onChange={e => {
              setRegion(e.target.value);
              setCity('');
            }}
            disabled={locationDisabled}
            required={!isOnline}
          >
            <option value="">Select Region</option>
            {regions.map(r => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <select
            className="border rounded p-2"
            value={city}
            onChange={e => setCity(e.target.value)}
            disabled={locationDisabled || !region}
            required={!isOnline}
          >
            <option value="">{region ? 'Select City' : 'Select Region first'}</option>
            {cities.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <input
            className="border rounded p-2"
            placeholder="Address (optional)"
            value={address}
            onChange={e => setAddress(e.target.value)}
            disabled={locationDisabled}
          />
        </div>

        <button className="qg-btn qg-btn--primary px-4 py-2" disabled={busy}>
          {busy ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </main>
  );
}

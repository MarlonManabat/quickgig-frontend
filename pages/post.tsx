import { useState, useEffect } from 'react';
import { createJob } from '@/lib/jobs';
import { requireTicket } from '@/lib/tickets';
import { useRequireUser } from '@/lib/useRequireUser';

export default function PostJobPage() {
  const { ready, userId, timedOut } = useRequireUser();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [regions, setRegions] = useState<Array<{ id: string; name: string }>>([]);
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([]);
  const [regionId, setRegionId] = useState('');
  const [cityId, setCityId] = useState('');
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/locations/regions').then(r => r.json());
        setRegions(r);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRegions(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!regionId) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    fetch(`/api/locations/cities?regionId=${regionId}`)
      .then(r => r.json())
      .then(setCities)
      .catch(err => {
        console.error(err);
        setCities([]);
      })
      .finally(() => setLoadingCities(false));
  }, [regionId]);

  const locationDisabled = isOnline;
  const regionName = regions.find(r => r.id === regionId)?.name || '';
  const cityName = cities.find(c => c.id === cityId)?.name || '';

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
        region: locationDisabled ? null : regionName || null,
        city: locationDisabled ? null : cityName || null,
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
            data-testid="region-select"
            className="border rounded p-2"
            value={regionId}
            onChange={e => {
              setRegionId(e.target.value);
              setCityId('');
            }}
            disabled={locationDisabled}
            required={!isOnline}
          >
            <option value="">
              {loadingRegions
                ? 'Loading regions…'
                : regions.length
                ? 'Select Region'
                : 'No regions available'}
            </option>
            {regions.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            data-testid="city-select"
            className="border rounded p-2"
            value={cityId}
            onChange={e => setCityId(e.target.value)}
            disabled={locationDisabled || !regionId}
            required={!isOnline}
          >
            <option value="">
              {!regionId
                ? 'Select Region first'
                : loadingCities
                ? 'Loading cities…'
                : cities.length
                ? 'Select City'
                : 'No cities'}
            </option>
            {cities.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
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

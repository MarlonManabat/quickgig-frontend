import { useState, useMemo } from 'react';
import {
  REGIONS,
  getCitiesForRegion,
  type RegionKey,
} from '@/lib/locations/phRegions';
import { createJob } from '@/lib/jobs';

function regionLabelFromKey(key: string | undefined) {
  return REGIONS.find(r => r.key === key)?.label ?? '';
}

function cityLabelFromKey(regionKey: string, cityKey: string) {
  const match = getCitiesForRegion(regionKey as RegionKey).find(
    c => c.value === cityKey,
  );
  return match?.label ?? '';
}

export default function PostJobPage() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);

  const cities = useMemo(
    () => getCitiesForRegion((region || null) as RegionKey | null),
    [region],
  );
  const locationDisabled = isOnline;

  async function onSubmit(e: any) {
    e.preventDefault();
    setBusy(true);
    try {
      await createJob({
        title: title.trim(),
        company: company.trim() || undefined,
        is_online: isOnline,
        location_region: locationDisabled
          ? null
          : regionLabelFromKey(region) || null,
        location_city: locationDisabled
          ? null
          : cityLabelFromKey(region, city) || null,
        location_address: locationDisabled ? null : address.trim() || null,
      });
      window.location.href = '/find';
    } catch (err: any) {
      console.error(err);
      alert('Could not post job');
    } finally {
      setBusy(false);
    }
  }

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
            {REGIONS.map(r => (
              <option key={r.key} value={r.key}>
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

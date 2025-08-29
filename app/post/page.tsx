'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { LocationValue } from '@/components/location/LocationSelect';

const FallbackLocation = ({ value, onChange }: { value: LocationValue; onChange: (v: LocationValue) => void }) => (
  <div className="grid gap-2">
    <input
      className="border p-2"
      placeholder="Region code"
      value={value.regionCode || ''}
      onChange={(e) => onChange({ ...value, regionCode: e.target.value })}
    />
    <input
      className="border p-2"
      placeholder="Province/HUC code"
      value={value.provinceCode || ''}
      onChange={(e) => onChange({ ...value, provinceCode: e.target.value })}
    />
    <input
      className="border p-2"
      placeholder="City code"
      value={value.cityCode || ''}
      onChange={(e) => onChange({ ...value, cityCode: e.target.value })}
    />
  </div>
);

const LocationSelect = dynamic(
  () => import('@/components/location/LocationSelect').catch(() => FallbackLocation),
  { ssr: false }
);

export default function PostPage() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState<LocationValue>({ regionCode: null, provinceCode: null, cityCode: null });
  const [status, setStatus] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const job = {
      title,
      company,
      regionCode: location.regionCode,
      adminUnitCode: location.provinceCode,
      cityCode: location.cityCode,
    };
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      if (!res.ok) throw new Error('failed');
    } catch {
      try {
        const stash = JSON.parse(localStorage.getItem('jobs-fallback') || '[]');
        const localJob = { ...job, id: Date.now().toString(), createdAt: new Date().toISOString() };
        stash.push(localJob);
        localStorage.setItem('jobs-fallback', JSON.stringify(stash));
      } catch {}
    }
    setStatus('Job posted');
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Post a Job</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="title"
          className="border rounded p-2 w-full"
          placeholder="Job title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          name="company"
          className="border rounded p-2 w-full"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <LocationSelect value={location} onChange={setLocation} />
        <button type="submit" className="qg-btn qg-btn--primary px-4 py-2">
          Submit
        </button>
      </form>
      {status && <p role="status" className="mt-2 text-green-700">{status}</p>}
    </main>
  );
}

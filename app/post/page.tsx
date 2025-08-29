'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { LocationValue } from '@/components/location/LocationSelect';

// Dynamic, SSR-off, so it can’t trip SSR on Vercel
const LocationSelect = dynamic(() => import('@/components/location/LocationSelect'), {
  ssr: false,
  // If import fails, show a tiny inline fallback (prevents blank UI on preview)
  loading: () => (
    <fieldset className="grid gap-3">
      <label>Region<input className="input" placeholder="Loading…" disabled /></label>
      <label>Province / Metro / HUC<input className="input" placeholder="Loading…" disabled /></label>
      <label>City / LGU<input className="input" placeholder="Loading…" disabled /></label>
    </fieldset>
  ),
});

export default function PostJobPage() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState<LocationValue>({
    regionCode: null,
    provinceCode: null,
    cityCode: null,
  });
  const [widgetHealthy, setWidgetHealthy] = useState(true);

  // Catch client-side mount errors of the widget and flip to hard fallback
  useEffect(() => {
    const orig = console.error;
    console.error = (...args) => {
      if (String(args[0] ?? '').toLowerCase().includes('locationselect')) setWidgetHealthy(false);
      // @ts-ignore
      orig(...args);
    };
    return () => { console.error = orig as any; };
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: integrate credits + submit
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Post a Job</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="input" name="title" placeholder="Job title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input className="input" name="company" placeholder="Company (optional)" value={company} onChange={e=>setCompany(e.target.value)} />

        {/* Preferred widget; if it fails at runtime, we render the hard fallback below */}
        {widgetHealthy ? (
          <LocationSelect value={location} onChange={(v) => setLocation(v)} />
        ) : (
          <fieldset className="grid gap-3">
            <label>Region<input className="input" name="regionText" placeholder="Region" /></label>
            <label>Province / Metro / HUC<input className="input" name="provinceText" placeholder="Province / Metro / HUC" /></label>
            <label>City / LGU<input className="input" name="cityText" placeholder="City / LGU" /></label>
          </fieldset>
        )}

        <button type="submit" className="btn btn-primary mt-2" aria-label="Post Job">Post Job</button>
      </form>
    </main>
  );
}

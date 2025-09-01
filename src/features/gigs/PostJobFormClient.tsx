'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GeoSelect, { type GeoValue } from '@/components/location/GeoSelect';
import toast from '@/utils/toast';

type Props = {
  onSubmitted?: () => void;            // optional callback
  submitUrl?: string;                  // default '/api/gigs/create' if your app uses that
};

export default function PostJobFormClient({ onSubmitted, submitUrl = '/api/gigs/create' }: Props) {
  const [geo, setGeo] = useState<GeoValue>({});
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    // include geo
    if (geo.regionCode) fd.set('region_code', geo.regionCode);
    if (geo.provinceCode) fd.set('province_code', geo.provinceCode);
    if (geo.cityCode) fd.set('city_code', geo.cityCode);
    if (geo.cityName) fd.set('city_name', geo.cityName);

    try {
      const res = await fetch(submitUrl, { method: 'POST', body: fd });
      if (res.status === 402 || res.status === 403) {
        toast.info('You need a ticket to post. Redirecting…');
        router.push('/billing/tickets?next=/gigs/create');
        return;
      }
      if (!res.ok) throw new Error('Failed to post job');
      toast.success('Job posted!');
      onSubmitted?.();
      form.reset();
      setGeo({});
    } catch (err) {
      console.error(err);
      toast.error('Could not post job. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* TODO: keep your existing fields; showing minimal core fields */}
      <input name="title" required placeholder="Job title" className="w-full border rounded-lg p-2" />
      <textarea name="description" required placeholder="Describe the work" className="w-full border rounded-lg p-2" />
      <GeoSelect value={geo} onChange={setGeo} className="mt-2" />
      <div className="flex gap-2">
        <input name="budget" type="number" min="0" step="1" placeholder="Budget (₱)" className="border rounded-lg p-2 w-40" />
        <button type="submit" className="rounded-xl px-4 py-2 font-medium border">Post Job</button>
      </div>
    </form>
  );
}

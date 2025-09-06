'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from '@/utils/toast';
import { getRegions, getCitiesByRegion } from '@/lib/ph/locations';
import { ROUTES } from '@/lib/routes';

type Props = {
  onSubmitted?: () => void;
  submitUrl?: string; // default '/api/jobs/create'
  balance?: number;
};

export default function PostJobFormClient({
  onSubmitted,
  submitUrl = '/api/jobs/create',
  balance = 0,
}: Props) {
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const regions = useMemo(() => getRegions(), []);
  const cities = useMemo(() => (region ? getCitiesByRegion(region) : []), [region]);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('region', region);
    fd.set('city', city);

    try {
      const res = await fetch(submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd)),
      });
      if (res.status === 402 || res.status === 403) {
        toast.info('You need a ticket to post. Redirecting…');
        router.push('/billing/tickets?next=' + ROUTES.postJob);
        return;
      }
      if (!res.ok) throw new Error('Failed to post job');
      const { id } = await res.json();
      toast.success('Job posted!');
      onSubmitted?.();
      form.reset();
      setRegion('');
      setCity('');
      router.push(`/jobs/${id}`);
    } catch (err) {
      console.error(err);
      toast.error('Could not post job. Please try again.');
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* TODO: keep your existing fields; showing minimal core fields */}
        <input
          name="title"
          required
          placeholder="Job title"
          className="w-full border rounded-lg p-2"
        />
        <textarea
          name="description"
          required
          placeholder="Describe the work"
          className="w-full border rounded-lg p-2"
        />
        <input
          name="category"
          placeholder="Category"
          className="w-full border rounded-lg p-2"
        />
        <select
          data-testid="select-region"
          className="w-full border rounded-lg p-2"
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            setCity('');
          }}
          required
        >
          <option value="">Select region</option>
          {regions.map((r) => (
            <option key={r.code} value={r.code}>
              {r.name}
            </option>
          ))}
        </select>
        <select
          data-testid="select-city"
          className="w-full border rounded-lg p-2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!region}
          required
        >
          <option value="">Select city</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            name="salary_min"
            type="number"
            min="0"
            step="1"
            placeholder="Min ₱"
            className="border rounded-lg p-2 w-40"
          />
          <input
            name="salary_max"
            type="number"
            min="0"
            step="1"
            placeholder="Max ₱"
            className="border rounded-lg p-2 w-40"
          />
          <button
            data-testid="post-job-submit"
            type="submit"
            className="rounded-xl px-4 py-2 font-medium border"
          >
            Post Job
          </button>
        </div>
      </form>
      {balance === 0 && (
        <p className="mt-2 text-sm">
          You need a ticket to post.{' '}
          <Link href={`/billing/tickets?next=${ROUTES.postJob}`} className="underline">
            Buy ticket
          </Link>
          .
        </p>
      )}
    </div>
  );
}

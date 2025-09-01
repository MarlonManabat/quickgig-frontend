'use client';

import { useState, FormEvent } from 'react';
import { useUser } from '@/hooks/useUser';

export default function PostGigForm() {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [payMin, setPayMin] = useState('');
  const [payMax, setPayMax] = useState('');
  const [remote, setRemote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError('Please sign in to post a gig.');
      return;
    }
    if (!title.trim() || !company.trim() || !description.trim()) {
      setError('Title, company and description are required');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/gigs/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        company,
        location: location || undefined,
        description,
        payMin: payMin ? Number(payMin) : undefined,
        payMax: payMax ? Number(payMax) : undefined,
        remote,
        owner: user.id,
        user_id: user.id,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Failed to post gig' }));
      setError(data.error || 'Failed to post gig');
      setLoading(false);
      return;
    }
    const data = await res.json();
    setCreatedId(data.id);
    setLoading(false);
  }

  if (createdId) {
    return (
      <div className="space-y-4">
        <p className="text-green-700">Gig posted successfully!</p>
        <p>
          <a href={`/gigs/${createdId}`} className="text-blue-600 underline mr-2">
            View gig
          </a>
          <a href="/gigs" className="text-blue-600 underline">
            Back to gigs
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block">
          <span className="block text-sm font-medium">Title*</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Company*</span>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Location</span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Description*</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
            rows={5}
          />
        </label>
        <div className="flex gap-4">
          <label className="block flex-1">
            <span className="block text-sm font-medium">Pay Min</span>
            <input
              type="number"
              value={payMin}
              onChange={(e) => setPayMin(e.target.value)}
              className="border p-2 w-full"
            />
          </label>
          <label className="block flex-1">
            <span className="block text-sm font-medium">Pay Max</span>
            <input
              type="number"
              value={payMax}
              onChange={(e) => setPayMax(e.target.value)}
              className="border p-2 w-full"
            />
          </label>
        </div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={remote}
            onChange={(e) => setRemote(e.target.checked)}
          />
          <span>Remote</span>
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary px-4 py-2 disabled:opacity-50"
      >
        {loading ? 'Posting…' : 'Post Gig'}
      </button>
    </form>
  );
}

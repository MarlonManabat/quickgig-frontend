'use client';
import { useState } from 'react';

export default function PostGigPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true); setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get('title'),
      description: fd.get('description'),
      city: fd.get('city'),
      budget: Number(fd.get('budget')) || null,
      owner: 'stub-owner',
    };
    const res = await fetch('/api/gigs', { method: 'POST', body: JSON.stringify(payload) });
    if (!res.ok) setError((await res.json()).error ?? 'Failed to create');
    setSubmitting(false);
    if (res.ok) window.location.href = '/gigs';
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Post a gig</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input name="title" placeholder="Title" required className="border rounded p-2" />
        <textarea name="description" placeholder="Description" required className="border rounded p-2 min-h-[160px]" />
        <div className="grid grid-cols-2 gap-3">
          <input name="city" placeholder="City" className="border rounded p-2" />
          <input name="budget" type="number" placeholder="Budget" className="border rounded p-2" />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button disabled={submitting} className="rounded bg-black text-white px-4 py-2 w-fit">
          {submitting ? 'Posting…' : 'Post gig'}
        </button>
      </form>
    </main>
  );
}

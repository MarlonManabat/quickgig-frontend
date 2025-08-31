'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GigForm() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', budget: '', city: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/gigs/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        budget: form.budget ? Number(form.budget) : null,
        city: form.city || null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Failed to create gig');
      return;
    }
    router.push(`/gigs/${data.id}`);
  };

  return (
    <form onSubmit={submit} className="grid gap-2">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input
        name="title"
        required
        placeholder="Title"
        className="border rounded p-2"
        value={form.title}
        onChange={handleChange}
      />
      <textarea
        name="description"
        required
        placeholder="Description"
        className="border rounded p-2 min-h-[120px]"
        value={form.description}
        onChange={handleChange}
      />
      <input
        type="number"
        name="budget"
        placeholder="Budget"
        className="border rounded p-2"
        value={form.budget}
        onChange={handleChange}
      />
      <input
        name="city"
        placeholder="City"
        className="border rounded p-2"
        value={form.city}
        onChange={handleChange}
      />
      <button type="submit" className="rounded bg-black text-white px-4 py-2 w-fit">
        Post
      </button>
    </form>
  );
}

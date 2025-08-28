'use client';
import { useState } from 'react';
import { mutate } from 'swr';
import PHCascade from '@/components/location/PHCascade';

export default function NewJobForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loc, setLoc] = useState<{ region?: string; province?: string; city?: string }>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/jobs/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        region_code: loc.region,
        province_code: loc.province,
        city_code: loc.city,
      }),
    });
    if (res.ok) {
      setSuccess(true);
      mutate('credits');
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed to post job');
    }
  };

  if (success) {
    return <p>Job posted!</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border p-2 w-full"
        required
      />
      <textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="border p-2 w-full"
        required
      />
      <PHCascade value={loc} onChange={setLoc} required />
      <button type="submit" className="px-4 py-2 bg-black text-white rounded">
        Post
      </button>
    </form>
  );
}

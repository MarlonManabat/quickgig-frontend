'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  initial: {
    fullName?: string;
    location?: string;
    bio?: string;
  };
}

export default function Form({ initial }: Props) {
  const [fullName, setFullName] = useState(initial.fullName ?? '');
  const [location, setLocation] = useState(initial.location ?? '');
  const [bio, setBio] = useState(initial.bio ?? '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        fullName,
        location: location || null,
        bio: bio || null,
      }),
    });
    if (res.ok) {
      setStatus('saved');
      router.refresh();
    } else {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Full name</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="border rounded px-4 py-2 disabled:opacity-50"
          disabled={status === 'saving'}
        >
          Save
        </button>
        {status === 'saved' && <span className="text-sm text-green-600">Saved</span>}
        {status === 'error' && <span className="text-sm text-rose-600">Error</span>}
      </div>
    </form>
  );
}

'use client';
import { useState } from 'react';

export default function NewJobForm() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title, desc }),
      });
      if (!r.ok) throw new Error(await r.text());
      setOk(true);
    } catch (e: any) {
      setErr(e.message || 'Failed');
    } finally {
      setBusy(false);
    }
  }

  if (ok) {
    return (
      <div className="rounded-lg border p-4">
        ✅ Job posted! Your credits have been updated.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          data-testid="job-title"
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          className="w-full border rounded p-2 min-h-[120px]"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
      </div>
      <button
        data-testid="job-submit"
        disabled={busy}
        className="px-4 py-2 rounded bg-black text-white"
      >
        {busy ? 'Posting…' : 'Post job'}
      </button>
      {err && <p className="text-red-600 text-sm">{err}</p>}
    </form>
  );
}


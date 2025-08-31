'use client';

import { useState } from 'react';

export default function ApplyButton({ gigId }: { gigId: number }) {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [unauth, setUnauth] = useState(false);

  const submit = async () => {
    setError(null);
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gig_id: gigId, cover_letter: cover }),
    });
    if (res.status === 401) {
      setUnauth(true);
      setOpen(false);
      return;
    }
    if (res.status === 409) {
      setError('You already applied.');
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed to apply');
      return;
    }
    setDone(true);
    setOpen(false);
  };

  if (done) return <p className="text-green-600">Application sent.</p>;
  if (unauth) return <p>Please log in to apply.</p>;

  return (
    <div>
      <button
        className="rounded bg-black text-white px-4 py-2"
        onClick={() => setOpen(true)}
        disabled={open}
      >
        Apply
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded space-y-2 max-w-md w-full">
            <textarea
              className="w-full border rounded p-2"
              placeholder="Cover letter (optional)"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => {
                  setOpen(false);
                  setError(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={submit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

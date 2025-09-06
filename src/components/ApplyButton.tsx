'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from '@/utils/toast';

export default function ApplyButton({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    const res = await fetch('/api/applications/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, coverNote: note }),
    });
    if (res.status === 409) {
      setError('You already applied to this job.');
      setSubmitting(false);
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed to apply');
      setSubmitting(false);
      return;
    }
    toast.success('Application submitted');
    router.push('/applications');
  };

  return (
    <div>
      <button
        data-testid="apply-button"
        data-cta="apply-open"
        className="rounded bg-black text-white px-4 py-2"
        onClick={() => setOpen(true)}
        disabled={open}
      >
        Apply
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded space-y-2 max-w-md w-full">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <textarea
              id="apply-cover-note"
              data-testid="apply-cover-note"
              className="w-full border rounded p-2"
              placeholder="Cover note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
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
                data-testid="apply-submit"
                data-cta="apply-submit"
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                disabled={submitting}
                onClick={submit}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

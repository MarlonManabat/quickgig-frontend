'use client';

import { useState } from 'react';
import type { ApplicationResponse } from '@/types/applications';

export default function ApplyPanel({ gigId }: { gigId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gig_id: gigId }),
      });
      const data = (await res.json().catch(() => ({}))) as Partial<ApplicationResponse> & {
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error || 'Failed to apply');
      }
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <p className="text-green-600 text-sm">Application submitted</p>;
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        onClick={apply}
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Applying...' : 'Apply'}
      </button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { API } from '@/config/api';
import { env } from '@/config/env';
import { toast } from '@/lib/toast';
import { apiPost } from '@/lib/api';

interface Props {
  targetId: string | number;
  type: 'job' | 'user';
}

export default function ReportButton({ targetId, type }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('Scam');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  if (!env.NEXT_PUBLIC_ENABLE_REPORTS) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost(API.reportCreate, { type, targetId, reason, details });
      toast('Thanks — our moderators will review.');
      setOpen(false);
      setReason('Scam');
      setDetails('');
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-red-600 hover:underline"
      >
        Report
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={submit}
            className="bg-white rounded p-4 w-full max-w-sm space-y-2"
          >
            <h2 className="text-lg font-semibold">Report {type}</h2>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border px-2 py-1"
            >
              <option>Scam</option>
              <option>Inappropriate</option>
              <option>Spam</option>
              <option>Other</option>
            </select>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Details (optional)"
              className="w-full border px-2 py-1"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}


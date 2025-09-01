'use client';

import { useState } from 'react';
import type { ApplicantRow } from '@/types/owner';

export default function ApplicantsTable({ items }: { items: ApplicantRow[] }) {
  const [rows, setRows] = useState(items);

  const updateStatus = async (
    id: string,
    status: 'accepted' | 'rejected',
  ) => {
    setRows((r) => r.map((a) => (a.id === id ? { ...a, status } : a)));
    try {
      await fetch(`/api/applications/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      // ignore
    }
  };

  if (rows.length === 0) return <p>No applicants yet.</p>;

  return (
    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-gray-50">
          <th className="p-2 text-left">Applicant</th>
          <th className="p-2 text-left">Submitted</th>
          <th className="p-2">Status</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((a) => (
          <tr key={a.id} className="border-t">
            <td className="p-2">{a.applicant}</td>
            <td className="p-2">
              {new Date(a.created_at).toLocaleDateString()}
            </td>
            <td className="p-2 capitalize">{a.status}</td>
            <td className="p-2 flex gap-2 justify-center">
              <button
                className="px-2 py-1 border rounded"
                disabled={a.status !== 'submitted'}
                onClick={() => updateStatus(a.id, 'accepted')}
              >
                Accept
              </button>
              <button
                className="px-2 py-1 border rounded"
                disabled={a.status !== 'submitted'}
                onClick={() => updateStatus(a.id, 'rejected')}
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

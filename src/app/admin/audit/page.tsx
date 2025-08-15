'use client';

import { useEffect, useState } from 'react';
import { API } from '@/config/api';
import { env } from '@/config/env';

interface AuditItem {
  at: string;
  actor: string;
  action: string;
  target: string;
  meta?: unknown;
}

export default function AdminAuditPage() {
  const [items, setItems] = useState<AuditItem[] | null>(null);
  const [view, setView] = useState<AuditItem | null>(null);

  useEffect(() => {
    fetch(`${env.NEXT_PUBLIC_API_URL}${API.adminAuditList}`)
      .then((r) => r.json())
      .then((d) => setItems((d.items as AuditItem[]) || d))
      .catch(() => setItems([]));
  }, []);

  if (!items) return <main className="p-4">Loading...</main>;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Audit Log</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Time</th>
            <th className="border px-2 py-1">Actor</th>
            <th className="border px-2 py-1">Action</th>
            <th className="border px-2 py-1">Target</th>
            <th className="border px-2 py-1">Meta</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{i.at}</td>
              <td className="border px-2 py-1">{i.actor}</td>
              <td className="border px-2 py-1">{i.action}</td>
              <td className="border px-2 py-1">{i.target}</td>
              <td className="border px-2 py-1">
                {i.meta ? (
                  <button
                    className="text-blue-600"
                    onClick={() => setView(i)}
                  >
                    View
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {view && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 rounded max-w-md w-full">
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(view.meta, null, 2)}
            </pre>
            <button
              onClick={() => setView(null)}
              className="mt-2 px-3 py-1 border rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


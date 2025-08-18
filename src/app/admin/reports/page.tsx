'use client';

import { useEffect, useState } from 'react';
import HeadSEO from '@/components/HeadSEO';
import { t } from '@/lib/i18n';
import type { JobReport } from '@/types/metrics';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<JobReport[]>([]);
  const [q, setQ] = useState('');

  async function load() {
    const r = await fetch('/api/admin/reports');
    const j = await r.json();
    setReports(j.reports || []);
  }
  useEffect(() => { load(); }, []);

  const filtered = reports.filter((r) =>
    [r.reason, r.resolved ? 'resolved' : 'open'].some((f) => f.includes(q)),
  );

  async function resolve(id: string) {
    await fetch('/api/admin/reports', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, resolved: true }),
    });
    load();
  }
  async function pause(jobId: string) {
    await fetch(`/api/employer/jobs/${jobId}/status`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'paused' }),
    });
    load();
  }

  return (
    <>
      <HeadSEO title="Admin reports | QuickGig" />
      <main className="p-4 space-y-4">
        <h1 className="text-xl font-bold">{t('admin_reports')}</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter"
          className="border p-2"
        />
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Created</th>
              <th className="border px-2 py-1">Job</th>
              <th className="border px-2 py-1">Reason</th>
              <th className="border px-2 py-1">Notes</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="border px-2 py-1">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1">
                  <a href={`/jobs/${r.jobId}`} className="underline" target="_blank" rel="noreferrer">
                    {r.jobId}
                  </a>
                </td>
                <td className="border px-2 py-1">{r.reason}</td>
                <td className="border px-2 py-1">{r.notes}</td>
                <td className="border px-2 py-1">{r.resolved ? 'resolved' : 'open'}</td>
                <td className="border px-2 py-1 space-x-2">
                  {!r.resolved && (
                    <button className="text-blue-600" onClick={() => resolve(r.id)}>
                      {t('resolve')}
                    </button>
                  )}
                  <button className="text-red-600" onClick={() => pause(r.jobId)}>
                    {t('pause_job')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}


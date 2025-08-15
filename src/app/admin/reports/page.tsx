'use client';

import { useEffect, useState } from 'react';
import { API } from '@/config/api';
import { env } from '@/config/env';
import { toast } from '@/lib/toast';

interface Report {
  id: string | number;
  type: string;
  target?: string;
  reason: string;
  submittedBy?: string;
  createdAt?: string;
  userId?: string | number;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[] | null>(null);

  const load = () => {
    fetch(`${env.NEXT_PUBLIC_API_URL}${API.adminReportsList}`)
      .then((r) => r.json())
      .then((d) => setReports((d.reports as Report[]) || d))
      .catch(() => setReports([]));
  };

  useEffect(() => {
    load();
  }, []);

  const notify = (to?: string, subject = '', html = '') => {
    if (!to) return;
    fetch('/api/notify/moderation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail: to, subject, html }),
    }).catch(() => {});
  };

  const act = async (id: string | number, action: 'dismiss' | 'remove' | 'ban', userId?: string | number) => {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${API.adminReportResolve(id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await res.json().catch(() => ({}));
    if (action === 'ban' && userId) {
      const banRes = await fetch(`${env.NEXT_PUBLIC_API_URL}${API.adminUserBan(userId)}`, {
        method: 'POST',
      });
      const banData = await banRes.json().catch(() => ({}));
      notify(banData.email || data.email, 'Account banned', 'Your account was banned.');
    }
    toast('Report updated');
    load();
  };

  if (!reports) return <main className="p-4">Loading...</main>;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Reports</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Target</th>
            <th className="border px-2 py-1">Reason</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td className="border px-2 py-1">{r.type}</td>
              <td className="border px-2 py-1">{r.target}</td>
              <td className="border px-2 py-1">{r.reason}</td>
              <td className="border px-2 py-1 space-x-2">
                <button onClick={() => act(r.id, 'dismiss')} className="text-gray-600">
                  Dismiss
                </button>
                <button onClick={() => act(r.id, 'remove')} className="text-red-600">
                  Remove
                </button>
                <button onClick={() => act(r.id, 'ban', r.userId)} className="text-red-800">
                  Ban
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}


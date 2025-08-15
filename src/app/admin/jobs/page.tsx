'use client';

import { useEffect, useState } from 'react';
import { API } from '@/config/api';
import { env } from '@/config/env';
import { toast } from '@/lib/toast';

interface Job {
  id: string | number;
  title: string;
  company?: string;
  submittedAt?: string;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[] | null>(null);

  const load = () => {
    fetch(`${env.NEXT_PUBLIC_API_URL}${API.adminJobsPending}`)
      .then((r) => r.json())
      .then((d) => setJobs((d.jobs as Job[]) || d))
      .catch(() => setJobs([]));
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

  const approve = async (id: string | number) => {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${API.adminJobApprove(id)}`, {
      method: 'POST',
    });
    const data = await res.json().catch(() => ({}));
    notify(data.email, 'Job approved', 'Your job was approved.');
    toast('Job approved');
    load();
  };

  const reject = async (id: string | number) => {
    const reason = prompt('Reason (optional)') || '';
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${API.adminJobReject(id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json().catch(() => ({}));
    notify(data.email, 'Job rejected', 'Your job was rejected.');
    toast('Job rejected');
    load();
  };

  if (!jobs) return <main className="p-4">Loading...</main>;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Pending Jobs</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-left">Title</th>
            <th className="border px-2 py-1 text-left">Company</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td className="border px-2 py-1">{j.title}</td>
              <td className="border px-2 py-1">{j.company}</td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => approve(j.id)}
                  className="text-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(j.id)}
                  className="text-red-600"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}


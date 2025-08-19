'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API } from '@/config/api';
import { apiGet } from '@/lib/api';

interface Summary {
  counts?: { pendingJobs?: number; reports?: number; users?: number };
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    apiGet<Summary>(API.adminSummary)
      .then(setSummary)
      .catch(() => setSummary({}));
  }, []);

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Link href="/admin/jobs" className="border rounded p-4 block">
          <p className="text-sm">Pending Jobs</p>
          <p className="text-2xl font-semibold">
            {summary?.counts?.pendingJobs ?? 0}
          </p>
        </Link>
        <Link href="/admin/reports" className="border rounded p-4 block">
          <p className="text-sm">Open Reports</p>
          <p className="text-2xl font-semibold">
            {summary?.counts?.reports ?? 0}
          </p>
        </Link>
        <Link href="/admin/users" className="border rounded p-4 block">
          <p className="text-sm">Banned Users</p>
          <p className="text-2xl font-semibold">
            {summary?.counts?.users ?? 0}
          </p>
        </Link>
        <Link href="/admin/metrics" className="border rounded p-4 block">
          <p className="text-sm">Metrics</p>
        </Link>
      </div>
    </main>
  );
}


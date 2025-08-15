'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/apiClient';
import { API } from '@/config/api';
import type { Job } from '@/types/jobs';
import ApplyButton from './apply-button';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<Job[]>(API.jobs, {
          params: { status: 'active', page: 1, limit: 20 },
        });
        setJobs(res.data);
      } catch {
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <main className="p-4">
        <p>Loading jobs...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4">
        <p>{error}</p>
      </main>
    );
  }

  if (!jobs.length) {
    return (
      <main className="p-4">
        <p>No jobs found.</p>
      </main>
    );
  }

  return (
    <main className="p-4 space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="border rounded p-4 flex justify-between items-center"
        >
          <div>
            <h2 className="font-semibold">
              <Link href={`/jobs/${job.id}`}>{job.title}</Link>
            </h2>
            <p className="text-sm text-gray-600">
              {job.company} · {job.location} · {job.rate}
            </p>
          </div>
          <ApplyButton jobId={String(job.id)} title={job.title} />
        </div>
      ))}
    </main>
  );
}

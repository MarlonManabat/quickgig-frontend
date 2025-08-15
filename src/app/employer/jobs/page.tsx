'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/apiClient';
import { API } from '@/config/api';

interface MyJob {
  id: number | string;
  title: string;
  published: boolean;
  updatedAt: string;
}

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<MyJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await api.get<MyJob[]>(API.myJobs);
      setJobs(res.data);
    } catch {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id: number | string, published: boolean) => {
    try {
      await api.post(API.toggleJob(id), { published: !published });
      await load();
    } catch {
      // ignore
    }
  };

  if (loading)
    return (
      <main className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
        ))}
      </main>
    );
  if (error) return <main className="p-4">{error}</main>;

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-4">My Jobs</h1>
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Updated</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b">
              <td className="p-2">{job.title}</td>
              <td className="p-2">{job.published ? 'Published' : 'Draft'}</td>
              <td className="p-2">{new Date(job.updatedAt).toLocaleDateString()}</td>
              <td className="p-2 space-x-2">
                <Link
                  href={`/employer/jobs/${job.id}/edit`}
                  className="text-qg-accent"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggle(job.id, job.published)}
                  className="text-qg-accent"
                >
                  {job.published ? 'Unpublish' : 'Publish'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

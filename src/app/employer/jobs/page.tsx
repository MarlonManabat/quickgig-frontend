'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  listJobs,
  publishJob,
  pauseJob,
  EmployerJob,
  closeJob,
  reopenJob,
  bulkRejectJob,
} from '@/lib/employerStore';
import { toast } from '@/lib/toast';
import { jobState } from '@/lib/jobCloseout';
import { env } from '@/config/env';

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await listJobs();
      setJobs(res);
    } catch {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (job: EmployerJob) => {
    try {
      if (job.status === 'published') {
        await pauseJob(job.id);
        toast('Job paused');
      } else {
        await publishJob(job.id);
        toast('Job published');
      }
      await load();
    } catch {
      toast('Failed to update');
    }
  };

  const close = async (job: EmployerJob) => {
    try {
      await closeJob(job.id, { reason: 'filled', bulkNotify: false });
      toast('Job closed');
      await load();
    } catch {
      toast('Failed to close');
    }
  };

  const reopen = async (job: EmployerJob) => {
    try {
      await reopenJob(job.id);
      toast('Job reopened');
      await load();
    } catch {
      toast('Failed to reopen');
    }
  };

  const bulk = async (job: EmployerJob) => {
    try {
      const r = await bulkRejectJob(job.id);
      toast(`Notified ${r.count} applicants`);
    } catch {
      toast('Failed to notify');
    }
  };

  if (loading) return <main className="p-4">Loading...</main>;
  if (error) return <main className="p-4">{error}</main>;

  return (
    <main className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">My Jobs</h1>
        <Link
          href="/employer/jobs/new"
          className="bg-qg-accent text-white px-3 py-1 rounded"
        >
          New job (draft)
        </Link>
      </div>
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
              <td className="p-2 capitalize">
                {env.NEXT_PUBLIC_ENABLE_JOB_CLOSEOUT ? jobState(job) : job.status}
              </td>
              <td className="p-2">{new Date(job.updatedAt).toLocaleDateString()}</td>
              <td className="p-2 space-x-2">
                <Link
                  href={`/employer/jobs/${job.id}/edit`}
                  className="text-qg-accent"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggle(job)}
                  className="text-qg-accent"
                >
                  {job.status === 'published' ? 'Pause' : 'Publish'}
                </button>
                {env.NEXT_PUBLIC_ENABLE_JOB_CLOSEOUT && !job.closeout && (
                  <button onClick={() => close(job)} className="text-qg-accent">
                    Close
                  </button>
                )}
                {env.NEXT_PUBLIC_ENABLE_JOB_CLOSEOUT && job.closeout && (
                  <>
                    <button onClick={() => reopen(job)} className="text-qg-accent">
                      Reopen
                    </button>
                    <button onClick={() => bulk(job)} className="text-qg-accent">
                      Bulk notify
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

import apiClient from '@/lib/apiClient';
import { API } from '@/config/api';
import type { Job } from '../../../types/jobs';
import ApplyButton from './apply-button';

export const dynamic = 'force-dynamic';

async function fetchJobs(): Promise<Job[]> {
  try {
    const res = await apiClient.get(API.jobs, {
      params: { status: 'active', page: 1, limit: 20 },
    });
    return res.data as Job[];
  } catch {
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await fetchJobs();
  if (!jobs.length) {
    return (
      <main className="p-4">
        <p>No jobs found.</p>
      </main>
    );
  }
  return (
    <main className="p-4 space-y-4">
      {jobs.map((job: Job) => (
        <div key={job.id} className="border rounded p-4 flex justify-between items-center">
          <div>
            <h2 className="font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.company} · {job.location} · {job.rate}</p>
          </div>
          <ApplyButton jobId={job.id} />
        </div>
      ))}
    </main>
  );
}

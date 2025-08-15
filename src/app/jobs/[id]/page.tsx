import { API } from '@/config/api';
import { env } from '@/config/env';
import ApplyButton from '../apply-button';
import type { Job } from '@/types/jobs';

interface JobPageProps {
  params: { id: string };
}

async function fetchJob(id: string): Promise<Job> {
  const res = await fetch(`${env.API_URL}${API.jobById(id)}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(String(res.status));
  }
  return res.json();
}

export async function generateMetadata({ params }: JobPageProps) {
  try {
    const job = await fetchJob(params.id);
    return {
      title: job.title,
      description: job.description,
      alternates: { canonical: `/jobs/${params.id}` },
    };
  } catch {
    return {
      title: 'Job not found',
      alternates: { canonical: `/jobs/${params.id}` },
    };
  }
}

export default async function JobPage({ params }: JobPageProps) {
  let job: Job;
  try {
    job = await fetchJob(params.id);
  } catch (err) {
    const status = Number((err as Error).message);
    if (status === 404) {
      return (
        <main className="p-4">
          <p>Job not found.</p>
        </main>
      );
    }
    return (
      <main className="p-4">
        <p>Failed to load job.</p>
      </main>
    );
  }

  return (
    <main className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{job.title}</h1>
        <p className="text-sm text-gray-600">
          {job.company} · {job.location} · {job.rate}
        </p>
      </div>
      <ApplyButton jobId={String(job.id)} title={job.title} />
      <p>{job.description}</p>
      {job.tags?.length ? (
        <ul className="flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <li
              key={tag}
              className="bg-gray-100 px-2 py-1 rounded text-sm"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}

import { API } from '@/config/api';
import { env } from '@/config/env';
import ApplyButton from '../apply-button';
import SaveJobButton from '@/components/SaveJobButton';
import type { Job } from '@/types/jobs';
import { canonical } from '@/lib/canonical';
import { getUser } from '@/auth/getUser';
import TrackView from './TrackView';
import ReportJob from './ReportJob';

interface JobPageProps {
  params: { id: string };
}

async function fetchJob(id: string): Promise<Job> {
  const res = await fetch(`${env.API_URL!}${API.jobById(id)}`, {
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
        alternates: { canonical: canonical(`/jobs/${params.id}`) },
      };
  } catch {
      return {
        title: 'Job not found',
        alternates: { canonical: canonical(`/jobs/${params.id}`) },
      };
  }
}

export default async function JobPage({ params }: JobPageProps) {
  let job: Job;
  const user = await getUser();
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
      <TrackView id={job.id} isEmployer={user?.isEmployer} />
      <div>
        <h1 className="text-xl font-semibold">{job.title}</h1>
        <p className="text-sm text-gray-600">
          {job.company} · {job.location} · {job.rate}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <ApplyButton jobId={String(job.id)} title={job.title} />
        <SaveJobButton id={job.id} />
      </div>
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
      {user ? <ReportJob id={String(job.id)} /> : null}
    </main>
  );
}

import Link from 'next/link';

import { hostAware } from '@/lib/hostAware';
import { fetchJob } from '@/lib/jobs';

import { ApplyButton } from './ApplyButton';

export const dynamic = 'force-dynamic';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await fetchJob(params.id);
  if (!job) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Job not found</h1>
        <Link className="text-blue-600 hover:underline" href={hostAware('/browse-jobs')}>
          Back to Jobs
        </Link>
      </main>
    );
  }

  // Build an auth-aware Apply link:
  // • If the job has a direct applyUrl, target it (respect absolute/relative via hostAware).
  // • Otherwise, fall back to /login?next=<returnTo> on the configured APP host.
  const returnTo = `/browse-jobs/${encodeURIComponent(String(job.id))}`;
  const applyHref = job.applyUrl
    ? hostAware(job.applyUrl)
    : hostAware(`/login?next=${encodeURIComponent(returnTo)}`);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      <div className="text-sm text-gray-600">
        {job.company ?? '—'} • {job.location ?? 'Anywhere'}
      </div>
      <p className="mt-6 whitespace-pre-wrap">{job.description ?? ''}</p>
      <ApplyButton href={applyHref} jobId={job.id} title={job.title} />
    </main>
  );
}

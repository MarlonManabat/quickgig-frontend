import { getJob } from '@/lib/api';
import { formatRelative } from '@/libs/date';

export default async function JobPage({ params }: { params: { id: string } }) {
  try {
    const job = await getJob(params.id);
    const login = process.env.NEXT_PUBLIC_APP_HOST || '';
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-2">{job.title}</h1>
        <div className="text-sm">{job.company}</div>
        <div className="text-sm">{job.location}</div>
        <div className="text-xs text-gray-500">{formatRelative(job.postedAt)}</div>
        {job.description && <p className="mt-4">{job.description}</p>}
        {/* Preserve post-login return path so users come back to the job they intended to apply for */}
        <a
          data-testid="apply-button"
          href={`${login}/login?next=${encodeURIComponent(`/browse-jobs/${job.id}`)}`}
          className="mt-6 inline-block rounded bg-blue-500 px-4 py-2 text-white"
        >
          Apply
        </a>
      </main>
    );
  } catch (err) {
    console.error('failed to load job', err);
    return <div className="text-gray-600">Job not found.</div>;
  }
}

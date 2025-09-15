import Link from 'next/link';
import { hostAware } from '@/lib/hostAware';

type JobDetail = {
  id: string | number;
  title: string;
  company?: string;
  location?: string;
  description?: string;
  applyUrl?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getJob(id: string): Promise<JobDetail | null> {
  if (!API_BASE) return { id, title: 'Job', description: 'Details unavailable.' };
  try {
    const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    return data || null;
  } catch {
    return null;
  }
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id);
  if (!job) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-2">Job not found</h1>
        <Link className="underline" href="/browse-jobs">
          Back to jobs
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
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      {job.company ? <div className="text-gray-500">{job.company}</div> : null}
      {job.location ? <div className="text-gray-500">{job.location}</div> : null}
      <div className="prose mt-6">{job.description || '—'}</div>
      <a
        data-testid="apply-button"
        href={applyHref}
        className="mt-6 inline-block rounded bg-blue-500 px-4 py-2 text-white"
      >
        Apply
      </a>
    </main>
  );
}

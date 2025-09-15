import Link from 'next/link';
import { getJobs } from '@/lib/api';
import { formatRelative } from '@/libs/date';

type Search = {
  q?: string;
  page?: string;
  location?: string;
};

export default async function BrowseJobsPage({ searchParams }: { searchParams: Search }) {
  const page = Number(searchParams.page) || 1;
  const q = searchParams.q;
  const location = searchParams.location;

  let data;
  try {
    data = await getJobs({ q, page, location });
  } catch (err) {
    console.error('failed to load jobs', err);
    data = { items: [], page: 1, pageSize: 0, total: 0 } as const;
  }

  const baseParams = new URLSearchParams();
  if (q) baseParams.set('q', q);
  if (location) baseParams.set('location', location);

  const prevParams = new URLSearchParams(baseParams);
  prevParams.set('page', String(page - 1));
  const nextParams = new URLSearchParams(baseParams);
  nextParams.set('page', String(page + 1));

  const jobs = data.items;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Browse Jobs</h1>
      <div data-testid="jobs-list" className="grid gap-4">
        {jobs.length === 0 ? (
          <div className="text-gray-600">No jobs yet.</div>
        ) : (
          jobs.map((job) => (
            <article key={job.id} data-testid="job-card" className="rounded border p-4">
              <Link href={`/browse-jobs/${job.id}`} className="font-medium">
                {job.title}
              </Link>
              <div className="text-sm">{job.company}</div>
              <div className="text-sm">{job.location}</div>
              <div className="text-xs text-gray-500">{formatRelative(job.postedAt)}</div>
            </article>
          ))
        )}
      </div>
      {jobs.length > 0 && (
        <nav className="flex gap-4 mt-6">
          {page > 1 && (
            <Link href={`/browse-jobs?${prevParams.toString()}`}>Prev</Link>
          )}
          {data.page * data.pageSize < data.total && (
            <Link href={`/browse-jobs?${nextParams.toString()}`}>Next</Link>
          )}
        </nav>
      )}
    </main>
  );
}

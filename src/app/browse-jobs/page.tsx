import Link from 'next/link';

import { hostAware } from '@/lib/hostAware';
import { fetchJobs } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

type BrowseJobsPageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function BrowseJobsPage({ searchParams }: BrowseJobsPageProps) {
  const page = Number(searchParams?.page ?? 1) || 1;
  const { items } = await fetchJobs({ page, pageSize: 20 });

  if (!items?.length) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Browse Jobs</h1>
        <div data-testid="jobs-empty-state" className="text-gray-600">
          No jobs yet. Please check back later.
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Browse Jobs</h1>
      <ul data-testid="jobs-list" className="space-y-4">
        {items.map((job) => (
          <li key={String(job.id)} className="border rounded-lg p-4" data-testid="job-card">
            <div className="font-medium">{job.title}</div>
            <div className="text-sm text-gray-600">
              {job.company ?? '—'} • {job.location ?? 'Anywhere'}
            </div>
            <div className="mt-3">
              <Link
                className="text-blue-600 hover:underline"
                href={hostAware(`/browse-jobs/${encodeURIComponent(String(job.id))}`)}
              >
                View details
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


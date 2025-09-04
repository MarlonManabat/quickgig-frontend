import Link from 'next/link';
import { getSeededJobs } from '@/app/lib/seed';
import { ROUTES } from '@/lib/routes';
import { toAppPath } from '@/lib/urls';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BrowseJobsPage() {
  const jobs = await getSeededJobs();

  if (jobs.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Browse jobs</h1>
        <p data-testid="jobs-empty" className="opacity-70">No jobs yet</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Browse jobs</h1>
      <ul data-testid="jobs-list" className="space-y-3">
        {jobs.map((j) => (
          <li key={j.id} data-testid="job-card" className="rounded-xl border p-4">
            <Link href={`${toAppPath(ROUTES.browseJobs)}/${j.id}`}>{j.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import 'server-only';

import Link from 'next/link';
import { cookies } from 'next/headers';
import { hasAuthCookies } from '@/lib/auth/cookies';
import { fetchJob } from '@/lib/jobs';
import { readApplications } from '@/lib/applications';

export default async function MyApplicationsPage() {
  const jar = cookies();
  const authed = hasAuthCookies(jar);

  if (!authed) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">My Applications</h1>
        <p className="mt-4 text-gray-500">Please log in to view your applications.</p>
      </main>
    );
  }

  const applications = readApplications()
    .slice(0, 50)
    .sort((a, b) => b.ts - a.ts);

  type JobResult = Awaited<ReturnType<typeof fetchJob>>;
  const jobs = (
    await Promise.allSettled(applications.map((application) => fetchJob(application.id)))
  )
    .map((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        return { job: result.value, ts: applications[index].ts };
      }
      return null;
    })
    .filter((entry): entry is { job: NonNullable<JobResult>; ts: number } => Boolean(entry));

  if (!jobs.length) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">My Applications</h1>
        <div
          className="mt-6 rounded border border-dashed p-6 text-center text-slate-600"
          data-testid="applications-empty"
        >
          You haven’t applied to any jobs yet.
        </div>
        {process.env.NODE_ENV !== 'production' && (
          <form method="post" action="/api/applications/clear" className="mt-4">
            <button
              type="submit"
              className="rounded bg-gray-200 px-3 py-2 text-sm"
              data-testid="applications-clear"
            >
              Clear list
            </button>
          </form>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">My Applications</h1>
      <ul className="mt-6 space-y-3" data-testid="applications-list">
        {jobs.map(({ job, ts }) => {
          const id = String(job.id);
          const title = job.title?.trim() || `Job #${id}`;
          return (
            <li
              key={id}
              className="flex items-center justify-between rounded border p-4"
              data-testid="application-row"
            >
              <Link className="text-blue-600 underline" href={`/browse-jobs/${encodeURIComponent(id)}`}>
                {title}
              </Link>
              <span className="text-xs text-gray-500">Applied {new Date(ts).toLocaleString()}</span>
            </li>
          );
        })}
      </ul>
      {process.env.NODE_ENV !== 'production' && (
        <form method="post" action="/api/applications/clear" className="mt-4">
          <button
            type="submit"
            className="rounded bg-gray-200 px-3 py-2 text-sm"
            data-testid="applications-clear"
          >
            Clear list
          </button>
        </form>
      )}
    </main>
  );
}


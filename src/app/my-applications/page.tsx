import 'server-only';

import Link from 'next/link';
import { cookies } from 'next/headers';
import { hasAuthCookies } from '@/lib/auth/cookies';
import { fetchJob } from '@/lib/jobs';
import { readAppliedIdsFromCookie } from '@/lib/applications';

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

  const ids = readAppliedIdsFromCookie();
  const jobs = (
    await Promise.all(ids.map((id) => fetchJob(id)))
  ).filter((job): job is NonNullable<typeof job> => Boolean(job));

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
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">My Applications</h1>
      <ul className="mt-6 space-y-3" data-testid="applications-list">
        {jobs.map((job) => {
          const id = String(job.id);
          const title = job.title?.trim() || `Job #${id}`;
          return (
            <li key={id} className="rounded border p-4" data-testid="application-row">
              <Link className="text-blue-600 underline" href={`/browse-jobs/${encodeURIComponent(id)}`}>
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}


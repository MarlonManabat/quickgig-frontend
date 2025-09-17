import { cookies } from 'next/headers';

import { hostAware } from '@/lib/hostAware';
import { fetchJob } from '@/lib/jobs';
import { hasApplied } from '@/lib/applications';
import { isAuthedServer } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const authed = isAuthedServer(cookieStore);
  const id = params.id;
  const job = await fetchJob(id);

  // Build an auth-aware Apply href that always exists so tests & UX are stable.
  const returnTo = `/browse-jobs/${encodeURIComponent(String(id))}`;
  const loginHref = `${hostAware('/login')}?next=${encodeURIComponent(returnTo)}`;
  const appHref = job?.applyUrl ? hostAware(job.applyUrl) : hostAware('/applications');
  const applyHref = authed ? appHref : loginHref;

  // Even when the job failed to load, keep the page/CTA structure present.
  const jobMissing = !job;
  const applied = jobMissing ? false : hasApplied(job.id);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">
        {jobMissing ? 'Job details' : job.title}
      </h1>
      {!jobMissing && (
        <div className="text-sm text-gray-600">
          {job.company ?? '—'} • {job.location ?? 'Anywhere'}
        </div>
      )}
      <p className="mt-6 whitespace-pre-wrap">
        {jobMissing
          ? 'We couldn’t load this job right now, but you can still start the apply flow and finish after signing in.'
          : job.description ?? ''}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <a
          data-testid="apply-button"
          href={applyHref}
          aria-disabled={jobMissing ? 'true' : undefined}
          className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
        >
          Apply
        </a>
        {!jobMissing && applied && (
          <span className="rounded border border-green-200 bg-green-50 px-2 py-1 text-xs text-green-700">
            You’ve applied to this job
          </span>
        )}
      </div>
    </main>
  );
}

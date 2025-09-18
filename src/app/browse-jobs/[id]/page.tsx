import { hostAware } from '@/lib/hostAware';
import { fetchJob } from '@/lib/jobs';
import { hasApplied } from '@/lib/applications';
import { isAuthedServer } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  // Server-side check; the helper reads cookies internally.
  const authed = isAuthedServer();
  const id = params.id;
  const job = await fetchJob(id);

  const jobMissing = !job;
  const applied = jobMissing ? false : hasApplied(job.id);

  const detailPath = `/browse-jobs/${encodeURIComponent(String(id))}`;
  const loginFallback = hostAware(`/login?next=${encodeURIComponent(detailPath)}`);
  const applyHref = !jobMissing && authed
    ? job?.applyUrl
      ? hostAware(job.applyUrl)
      : hostAware('/applications')
    : loginFallback;

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
        {/* Apply CTA */}
        <a
          data-testid="apply-button"
          href={applyHref}
          aria-disabled={jobMissing ? "true" : undefined}
          className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
        >
          Apply
        </a>

        {/* Applied badge stays separate so we don't hide the CTA */}
        {!jobMissing && applied && (
          <span className="rounded border border-green-200 bg-green-50 px-2 py-1 text-xs text-green-700">
            You’ve applied to this job
          </span>
        )}
      </div>
    </main>
  );
}

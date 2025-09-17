import Link from 'next/link';

import { hasApplied } from '@/lib/applications';
import { hostAware } from '@/lib/hostAware';
import { fetchJobs } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

type SearchParams = { [key: string]: string | string[] | undefined };

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function parsePage(value: string | string[] | undefined, fallback = 1): number {
  const parsed = Number(firstValue(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function BrowseJobsPage({
  searchParams = {},
}: {
  searchParams?: SearchParams;
}) {
  const q = firstValue(searchParams.q).trim();
  const location = firstValue(searchParams.location).trim();
  const page = parsePage(searchParams.page, 1);
  const pageSize = 10;

  const { items, total } = await fetchJobs({ page, pageSize, q, location });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const linkClass = (disabled: boolean) =>
    `rounded border px-3 py-2 text-sm ${disabled ? 'pointer-events-none opacity-50' : ''}`;

  const qp = (overrides: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (location) params.set('location', location);
    params.set('page', String(page));
    Object.entries(overrides).forEach(([key, value]) => {
      if (value === undefined || value === '') params.delete(key);
      else params.set(key, String(value));
    });
    return `?${params.toString()}`;
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Browse Jobs</h1>
          <div className="text-sm text-gray-600">{total} results</div>
        </div>
      </div>

      <form
        method="get"
        action="/browse-jobs"
        className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[2fr,2fr,auto]"
      >
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Keyword</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="e.g. cashier, barista"
            className="rounded border px-3 py-2"
            data-testid="filter-q"
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Location</span>
          <input
            name="location"
            defaultValue={location}
            placeholder="City or area"
            className="rounded border px-3 py-2"
            data-testid="filter-location"
          />
        </label>
        <div className="flex items-end gap-2">
          <button className="rounded bg-blue-600 px-4 py-2 text-white" data-testid="filter-apply">
            Search
          </button>
          {(q || location) && (
            <Link
              href="/browse-jobs"
              className="rounded border px-4 py-2 text-sm"
              data-testid="filter-clear"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <div className="mt-8 rounded border p-6 text-gray-600" data-testid="jobs-empty-state">
          {q || location ? (
            <>
              No jobs found for{' '}
              <span className="font-medium">
                {q ? `“${q}”` : ''} {q && location ? 'in' : ''} {location ? `“${location}”` : ''}
              </span>
              . Try adjusting your filters.
            </>
          ) : (
            'No jobs yet. Please check back later.'
          )}
        </div>
      ) : (
        <ul className="mt-8 space-y-4" data-testid="jobs-list">
          {items.map((job) => {
            const applied = hasApplied(job.id);
            return (
              <li
                key={String(job.id)}
                className="flex items-start justify-between gap-4 rounded-lg border p-4"
                data-testid="job-card"
              >
                <div>
                  <div className="font-medium text-lg">{job.title ?? `Job #${job.id}`}</div>
                  <div className="text-sm text-gray-600">
                    {job.company ?? '—'} • {job.location ?? job.city ?? 'Anywhere'}
                  </div>
                  <div className="mt-3">
                    <Link
                      className="text-blue-600 hover:underline"
                      href={hostAware(`/browse-jobs/${encodeURIComponent(String(job.id))}`)}
                    >
                      View details
                    </Link>
                  </div>
                </div>
                {applied && (
                  <span className="rounded border border-green-200 bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                    Applied
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex flex-wrap items-center justify-between gap-3" aria-label="pagination">
          <Link className={linkClass(page <= 1)} aria-disabled={page <= 1} href={`/browse-jobs${qp({ page: 1 })}`}>
            First
          </Link>
          <Link
            className={linkClass(page <= 1)}
            aria-disabled={page <= 1}
            href={`/browse-jobs${qp({ page: Math.max(1, page - 1) })}`}
          >
            Prev
          </Link>
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <Link
            className={linkClass(page >= totalPages)}
            aria-disabled={page >= totalPages}
            href={`/browse-jobs${qp({ page: Math.min(totalPages, page + 1) })}`}
          >
            Next
          </Link>
          <Link
            className={linkClass(page >= totalPages)}
            aria-disabled={page >= totalPages}
            href={`/browse-jobs${qp({ page: totalPages })}`}
          >
            Last
          </Link>
        </nav>
      )}
    </main>
  );
}

import Link from "next/link";

import { hasApplied, readAppliedIdsFromCookie } from "@/lib/applications";
import { hostAware } from "@/lib/hostAware";
import { fetchJobs } from "@/lib/jobs";
import { withParams } from "@/lib/url";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | string[] | undefined, fallback = 1): number {
  const raw = firstValue(value);
  const parsed = raw ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function parsePageSize(
  value: string | string[] | undefined,
  fallback = 10,
): number {
  const raw = firstValue(value);
  const parsed = raw && raw.trim() !== "" ? Number(raw) : Number.NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(50, Math.max(1, Math.floor(parsed)));
}

function parseSort(
  value: string | string[] | undefined,
): "newest" | "relevance" | "pay" {
  const raw = (firstValue(value) ?? "").toLowerCase();
  return raw === "relevance" || raw === "pay" ? (raw as "relevance" | "pay") : "newest";
}

export default async function BrowseJobsPage({
  searchParams = {},
}: {
  searchParams?: SearchParams;
}) {
  const query = (firstValue(searchParams.q) ?? "").trim();
  const location = (firstValue(searchParams.location) ?? "").trim();
  const sort = parseSort(searchParams.sort);
  const page = parsePage(searchParams.page, 1);
  const pageSize = parsePageSize(searchParams.pageSize, 10);
  const appliedOnly = firstValue(searchParams.applied) === "1";

  const { items: fetchedItems, total } = await fetchJobs({
    page,
    pageSize,
    query,
    q: query,
    location,
    sort,
  });

  let items = fetchedItems;

  if (query) {
    const needle = query.toLowerCase();
    items = items.filter((job) => {
      const haystack = `${job.title ?? ""} ${job.company ?? ""} ${job.location ?? ""}`.toLowerCase();
      return haystack.includes(needle);
    });
  }

  if (location) {
    const locNeedle = location.toLowerCase();
    items = items.filter((job) => {
      const haystack = `${job.location ?? ""} ${job.city ?? ""}`.toLowerCase();
      return haystack.includes(locNeedle);
    });
  }

  if (appliedOnly) {
    const ids = new Set(readAppliedIdsFromCookie().map((id) => String(id)));
    items = ids.size === 0 ? [] : items.filter((job) => ids.has(String(job.id)));
  }

  const derivedTotal = appliedOnly ? items.length : total;
  const totalPages = Math.max(1, Math.ceil(Math.max(derivedTotal, 0) / pageSize));

  const showClear = Boolean(
    query ||
      location ||
      appliedOnly ||
      sort !== "newest" ||
      pageSize !== 10 ||
      firstValue(searchParams.page) ||
      firstValue(searchParams.pageSize),
  );

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Browse Jobs</h1>
      <div className="text-sm text-gray-600">{derivedTotal} results</div>

      <form
        method="get"
        action="/browse-jobs"
        className="mt-4 mb-6 flex flex-wrap items-end gap-3"
      >
        <input type="hidden" name="page" value="1" />
        <div className="min-w-[220px] flex-1">
          <label htmlFor="q" className="block text-sm font-medium">
            Search
          </label>
          <input
            id="q"
            name="q"
            defaultValue={query}
            placeholder="Keyword, company, location…"
            className="mt-1 w-full rounded border px-3 py-2"
            data-testid="filter-q"
          />
        </div>
        <div className="min-w-[180px]">
          <label htmlFor="location" className="block text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            name="location"
            defaultValue={location}
            placeholder="City or area"
            className="mt-1 w-full rounded border px-3 py-2"
            data-testid="filter-location"
          />
        </div>
        <div>
          <label htmlFor="sort" className="block text-sm font-medium">
            Sort
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="mt-1 rounded border px-3 py-2"
            data-testid="sort-select"
          >
            <option value="newest">Newest</option>
            <option value="relevance">Relevance</option>
            <option value="pay">Pay</option>
          </select>
        </div>
        <div>
          <label htmlFor="pageSize" className="block text-sm font-medium">
            Page size
          </label>
          <select
            id="pageSize"
            name="pageSize"
            defaultValue={String(pageSize)}
            className="mt-1 rounded border px-3 py-2"
            data-testid="filter-page-size"
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 pl-2">
          <input
            id="applied"
            name="applied"
            type="checkbox"
            value="1"
            defaultChecked={appliedOnly}
            className="h-4 w-4"
            data-testid="filter-applied"
          />
          <label htmlFor="applied" className="text-sm">
            Applied only
          </label>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="rounded bg-blue-600 px-4 py-2 text-white" data-testid="filter-apply">
            Filter
          </button>
          {showClear && (
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
        <div className="mt-8 rounded border p-6 text-gray-600" data-testid="jobs-empty">
          {appliedOnly ? (
            "No applied jobs yet. Start applying to track them here."
          ) : query || location ? (
            <>
              No jobs found for{" "}
              <span className="font-medium">
                {query ? `“${query}”` : ""} {query && location ? "in" : ""} {location ? `“${location}”` : ""}
              </span>
              . Try adjusting your filters.
            </>
          ) : (
            "No jobs yet. Please check back later."
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
                  <div className="text-lg font-medium">{job.title ?? `Job #${job.id}`}</div>
                  <div className="text-sm text-gray-600">
                    {job.company ?? "—"} • {job.location ?? job.city ?? "Anywhere"}
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

      {items.length > 0 && (
        <nav className="mt-8 flex flex-wrap items-center justify-between gap-3" aria-label="pagination">
          {(() => {
            const prevDisabled = page <= 1;
            const nextDisabled = page >= totalPages;
            const preserved = new URLSearchParams(searchParams as any);
            const baseParams = {
              pageSize,
              q: query || undefined,
              location: location || undefined,
              sort: sort !== "newest" ? sort : undefined,
              applied: appliedOnly ? "1" : undefined,
            } as const;

            const prevHref = !prevDisabled
              ? withParams(
                  "/browse-jobs",
                  { ...baseParams, page: Math.max(1, page - 1) },
                  preserved,
                )
              : undefined;
            const nextHref = !nextDisabled
              ? withParams(
                  "/browse-jobs",
                  { ...baseParams, page: Math.min(totalPages, page + 1) },
                  preserved,
                )
              : undefined;

            return (
              <>
                <a
                  data-testid="nav-prev"
                  {...(prevHref ? { href: prevHref } : {})}
                  aria-disabled={prevDisabled}
                  tabIndex={prevDisabled ? -1 : 0}
                  className={`rounded border px-3 py-2 text-sm ${prevDisabled ? "pointer-events-none opacity-50" : ""}`}
                >
                  Previous
                </a>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <a
                  data-testid="nav-next"
                  {...(nextHref ? { href: nextHref } : {})}
                  aria-disabled={nextDisabled}
                  tabIndex={nextDisabled ? -1 : 0}
                  className={`rounded border px-3 py-2 text-sm ${nextDisabled ? "pointer-events-none opacity-50" : ""}`}
                >
                  Next
                </a>
              </>
            );
          })()}
        </nav>
      )}
    </main>
  );
}

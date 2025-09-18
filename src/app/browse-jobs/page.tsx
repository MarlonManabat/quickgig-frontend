import Link from "next/link";
import type { ReadonlyURLSearchParams } from "next/navigation";

import { hasApplied, readAppliedIdsFromCookie } from "@/lib/applications";
import { hostAware } from "@/lib/hostAware";
import { fetchJobs } from "@/lib/jobs";
import { keepParams, withParams } from "@/lib/url";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined } | ReadonlyURLSearchParams;

function parsePage(value: string | null | undefined, fallback = 1): number {
  const raw = value ?? undefined;
  const parsed = raw ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function parsePageSize(
  value: string | null | undefined,
  fallback = 10,
): number {
  const raw = value ?? undefined;
  const parsed = raw && raw.trim() !== "" ? Number(raw) : Number.NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(50, Math.max(1, Math.floor(parsed)));
}

function parseSort(
  value: string | null | undefined,
): "newest" | "relevance" | "pay" {
  const raw = (value ?? "").toLowerCase();
  return raw === "relevance" || raw === "pay" ? (raw as "relevance" | "pay") : "newest";
}

function normalizeSearchParams(
  value?: SearchParams,
): ReadonlyURLSearchParams {
  if (!value) return new URLSearchParams();
  if (typeof (value as ReadonlyURLSearchParams).entries === "function") {
    return value as ReadonlyURLSearchParams;
  }
  const qs = new URLSearchParams();
  Object.entries(value).forEach(([key, raw]) => {
    if (Array.isArray(raw)) {
      raw.forEach((entry) => {
        if (entry != null) qs.append(key, entry);
      });
    } else if (raw != null) {
      qs.set(key, raw);
    }
  });
  return qs;
}

export default async function BrowseJobsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const normalized = normalizeSearchParams(searchParams);
  const sanitizedFilters = keepParams(normalized, ["q", "location"]);
  const rawQuery = sanitizedFilters.q ?? "";
  const rawLocation = sanitizedFilters.location ?? "";
  const q = rawQuery.trim();
  const locationFilter = rawLocation.trim();
  const sort = parseSort(normalized.get("sort"));
  const page = parsePage(normalized.get("page"), 1);
  const pageSize = parsePageSize(normalized.get("pageSize"), 10);
  const appliedOnly = normalized.get("applied") === "1";

  const { items: fetchedItems, total } = await fetchJobs({
    page,
    pageSize,
    q,
    location: locationFilter,
    sort,
  });

  let items = fetchedItems;

  if (appliedOnly) {
    const ids = new Set(readAppliedIdsFromCookie().map((id) => String(id)));
    items = ids.size === 0 ? [] : items.filter((job) => ids.has(String(job.id)));
  }

  const derivedTotal = appliedOnly ? items.length : total;
  const totalPages = Math.max(1, Math.ceil(Math.max(derivedTotal, 0) / pageSize));

  const showClear = Boolean(
    rawQuery ||
      rawLocation ||
      appliedOnly ||
      sort !== "newest" ||
      pageSize !== 10 ||
      page > 1,
  );

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Browse Jobs</h1>
      <div className="text-sm text-gray-600">{derivedTotal} results</div>

      <form
        role="search"
        method="get"
        action="/browse-jobs"
        className="mt-4 mb-6 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end"
      >
        <input type="hidden" name="page" value="1" />
        <div className="flex min-w-[220px] flex-1 md:min-w-[240px]">
          <label htmlFor="filter-q" className="sr-only">
            Search title or company
          </label>
          <input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={rawQuery}
            placeholder="Search title or company…"
            className="w-full rounded border px-3 py-2"
            data-testid="filter-q"
          />
        </div>
        <div className="flex min-w-[200px] flex-1 md:min-w-[220px]">
          <label htmlFor="filter-location" className="sr-only">
            City, State or Remote
          </label>
          <input
            id="filter-location"
            name="location"
            defaultValue={rawLocation}
            placeholder="City, State or Remote"
            className="w-full rounded border px-3 py-2"
            data-testid="filter-location"
          />
        </div>
        <div className="min-w-[160px]">
          <label htmlFor="sort" className="block text-sm font-medium">
            Sort
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="mt-1 w-full rounded border px-3 py-2"
            data-testid="sort-select"
          >
            <option value="newest">Newest</option>
            <option value="relevance">Relevance</option>
            <option value="pay">Pay</option>
          </select>
        </div>
        <div className="min-w-[140px]">
          <label htmlFor="pageSize" className="block text-sm font-medium">
            Page size
          </label>
          <select
            id="pageSize"
            name="pageSize"
            defaultValue={String(pageSize)}
            className="mt-1 w-full rounded border px-3 py-2"
            data-testid="filter-page-size"
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 md:pl-2">
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
        <div className="flex items-center gap-2 md:ml-auto">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white"
            data-testid="filters-apply"
          >
            Apply
          </button>
          {showClear && (
            <Link
              href={withParams("/browse-jobs", { page: 1, pageSize })}
              className="text-sm text-blue-600 hover:underline"
              data-testid="filters-clear"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <div className="mt-8 rounded border p-6 text-gray-600" data-testid="empty-state">
          {appliedOnly
            ? "No applied jobs yet. Start applying to track them here."
            : "No jobs found. Try adjusting your filters."}
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
            const preservedParams = keepParams(normalized, [
              "q",
              "location",
              "pageSize",
              "sort",
              "applied",
            ]);
            const baseParams = {
              ...preservedParams,
              q: q || undefined,
              location: locationFilter || undefined,
              sort: sort !== "newest" ? sort : undefined,
              pageSize,
              applied: appliedOnly ? "1" : undefined,
            } as const;
            const prevHref = withParams("/browse-jobs", {
              ...baseParams,
              page: Math.max(1, page - 1),
            });
            const nextHref = withParams("/browse-jobs", {
              ...baseParams,
              page: Math.min(totalPages, page + 1),
            });

            return (
              <>
                <a
                  data-testid="nav-prev"
                  href={prevDisabled ? undefined : prevHref}
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
                  href={nextDisabled ? undefined : nextHref}
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

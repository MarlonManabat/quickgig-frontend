'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { API, JobFilters, mapToJobQuery } from '@/config/api';
import type { Job } from '@/types/jobs';
import ApplyButton from './apply-button';
import SaveJobButton from '@/components/SaveJobButton';
import JobsFilters from '@/components/jobs/JobsFilters';
import { getSavedIds, hydrateSavedIds } from '@/lib/savedJobs';
import AlertModal from '@/components/alerts/AlertModal';
import { env } from '@/config/env';
import { track } from '@/lib/track';
import { apiGet } from '@/lib/api';

function JobsPageContent() {
  const router = useRouter();
  const search = useSearchParams()!;

  const [filters, setFilters] = useState<JobFilters>({ page: 1, limit: 20 });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);

  // read filters from URL
  useEffect(() => {
    const f: JobFilters = {
      q: search.get('q') || undefined,
      location: search.get('location') || undefined,
      category: search.get('category') || undefined,
      type: search.get('type') || undefined,
      remote: search.get('remote') === '1',
      minSalary: search.get('minSalary') ? Number(search.get('minSalary')) : undefined,
      maxSalary: search.get('maxSalary') ? Number(search.get('maxSalary')) : undefined,
      sort: (search.get('sort') as JobFilters['sort']) || undefined,
      page: search.get('page') ? Number(search.get('page')) : 1,
      limit: search.get('limit') ? Number(search.get('limit')) : 20,
      savedOnly: search.get('saved') === '1',
    };
    setFilters(f);
  }, [search]);

  // sync URL when filters change
  useEffect(() => {
    const qs = new URLSearchParams(mapToJobQuery(filters));
    for (const [k, v] of Array.from(qs.entries())) {
      if (!v) qs.delete(k);
    }
    router.replace(`/jobs?${qs.toString()}`, { scroll: false });
  }, [filters, router]);

  // load jobs
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (filters.savedOnly) {
          const ids = getSavedIds();
          const totalIds = ids.length;
          const limit = filters.limit || 20;
          const page = filters.page || 1;
          const start = (page - 1) * limit;
          const pageIds = ids.slice(start, start + limit).slice(0, 50);
          const res = await Promise.all(
            pageIds.map((id) =>
              apiGet<Job>(API.jobById(id)).catch(() => null)
            )
          );
          const items = res.filter(Boolean) as Job[];
          setJobs(items);
          setTotal(totalIds);
        } else {
          const res = await apiGet<
            | Job[]
            | { items: Job[]; total?: number }
            | { data: Job[]; total?: number }
          >(`${API.jobs}?${new URLSearchParams(mapToJobQuery(filters)).toString()}`);
          let items: Job[] = [];
          let total = 0;
          if (Array.isArray(res)) {
            items = res;
            total = res.length;
          } else if ('items' in res && Array.isArray(res.items)) {
            items = res.items;
            total = Number(res.total) || res.items.length;
          } else if ('data' in res && Array.isArray(res.data)) {
            items = res.data;
            total = Number(res.total) || res.data.length;
          }
          setJobs(items);
          setTotal(total);
        }
      } catch {
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters]);

  useEffect(() => {
    hydrateSavedIds();
  }, []);

  useEffect(() => {
    if (env.NEXT_PUBLIC_ENABLE_ANALYTICS) track('view_jobs');
  }, []);

  const totalPages = Math.ceil(total / (filters.limit || 20));

  const changePage = (p: number) => setFilters({ ...filters, page: p });
  const clearFilters = () => setFilters({ page: 1, limit: filters.limit });

  return (
    <main className="p-4 space-y-4">
      <JobsFilters filters={filters} onChange={setFilters} onClear={clearFilters} />
      {env.NEXT_PUBLIC_ENABLE_ALERTS && (
        <div className="flex justify-end">
          <button
            className="border px-2 py-1 rounded"
            onClick={() => setAlertOpen(true)}
          >
            Create Alert from filters
          </button>
        </div>
      )}
      {loading ? (
        <div className="space-y-2" aria-busy="true">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="p-4 border rounded">No jobs found.</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">
                  <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                </h2>
                <p className="text-sm text-gray-600">
                  {job.company} · {job.location} · {job.rate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SaveJobButton id={job.id} />
                <ApplyButton jobId={String(job.id)} title={job.title} />
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <nav className="flex items-center gap-2" aria-label="Pagination">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => changePage(Math.max(1, (filters.page || 1) - 1))}
            disabled={(filters.page || 1) <= 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`px-3 py-1 border rounded ${
                p === filters.page ? 'bg-gray-200' : ''
              }`}
              onClick={() => changePage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => changePage(Math.min(totalPages, (filters.page || 1) + 1))}
            disabled={(filters.page || 1) >= totalPages}
          >
            Next
          </button>
        </nav>
      )}
      <div aria-live="polite" className="sr-only">
        {loading ? 'Loading jobs' : `${total} jobs`}
      </div>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(window.location.href)}
        className="border px-2 py-1 rounded"
      >
        Copy link
      </button>
      {env.NEXT_PUBLIC_ENABLE_ALERTS && (
        <AlertModal
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
          initial={{ filters, email: true, frequency: 'daily' }}
          onSaved={() => setAlertOpen(false)}
        />
      )}
    </main>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <JobsPageContent />
    </Suspense>
  );
}

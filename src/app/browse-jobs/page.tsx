// Server component that fails soft when API is not configured.
import type { Metadata } from 'next';

type Job = {
  id: string | number;
  title: string;
  company?: string;
  location?: string;
  url?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchJobs(): Promise<Job[]> {
  if (!API_BASE) {
    console.warn(
      '[BrowseJobs] NEXT_PUBLIC_API_BASE_URL is not set; rendering empty state.',
    );
    return [];
  }
  try {
    const res = await fetch(`${API_BASE}/jobs`, {
      // Avoid caching in CI to reduce flakiness
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();
    // Accept either {jobs: Job[]} or Job[]
    return Array.isArray(data) ? data : Array.isArray(data.jobs) ? data.jobs : [];
  } catch (err) {
    console.error('[BrowseJobs] failed to load jobs:', err);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Browse Jobs • QuickGig',
};

export default async function BrowseJobsPage() {
  const jobs = await fetchJobs();

  if (!jobs.length) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Browse Jobs</h1>
        <div
          data-testid="jobs-empty-state"
          className="rounded-lg border p-8 text-center text-gray-500"
        >
          No jobs yet. Please check back later.
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Browse Jobs</h1>
      <ul data-testid="jobs-list" className="grid gap-4 md:grid-cols-2">
        {jobs.map((j) => (
          <li key={String(j.id)} className="rounded-lg border p-4">
            <a
              className="block"
              href={`/browse-jobs/${encodeURIComponent(String(j.id))}`}
            >
              <div className="text-lg font-medium">{j.title}</div>
              {j.company ? <div className="text-sm text-gray-500">{j.company}</div> : null}
              {j.location ? <div className="text-sm text-gray-500">{j.location}</div> : null}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}


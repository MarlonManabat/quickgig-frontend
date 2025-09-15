import 'server-only';

type Job = {
  id: number | string;
  title: string;
  company: string;
  location?: string;
};

async function fetchJobs(
  page = 1
): Promise<{ jobs: Job[]; nextPage: number | null }> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  // CI/Smoke environments may not set the real API.
  // Degrade gracefully so smoke can assert the empty state.
  if (!base) {
    console.warn(
      'NEXT_PUBLIC_API_BASE_URL not set; returning empty jobs for CI/smoke.'
    );
    return { jobs: [], nextPage: null };
  }
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/jobs?page=${page}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  } catch (err) {
    console.warn('Failed to load jobs, rendering empty state.', err);
    return { jobs: [], nextPage: null };
  }
}

export default async function BrowseJobsPage() {
  const { jobs } = await fetchJobs();
  if (!jobs || jobs.length === 0) {
    return (
      <div
        data-testid="jobs-empty-state"
        className="p-6 text-center text-slate-500"
      >
        No jobs yet — check back soon.
      </div>
    );
  }
  return (
    <ul className="divide-y" data-testid="jobs-list">
      {jobs.map((j) => (
        <li key={String(j.id)} className="p-4" data-testid="job-card">
          <a href={`/browse-jobs/${encodeURIComponent(String(j.id))}`}>
            <div className="font-medium">{j.title}</div>
            {j.company ? (
              <div className="text-slate-500">{j.company}</div>
            ) : null}
            {j.location ? (
              <div className="text-slate-500">{j.location}</div>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}


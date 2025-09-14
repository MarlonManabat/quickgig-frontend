export default async function BrowseJobsPage() {
  // TODO: replace with real fetch; for now show an explicit empty state container.
  const jobs: any[] = [];
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-xl font-semibold mb-4">Browse Jobs</h1>
      {jobs.length > 0 ? (
        <ul data-testid="jobs-list" className="grid gap-3">
          {jobs.map((j) => (
            <li key={j.id} className="rounded border p-4">
              {j.title}
            </li>
          ))}
        </ul>
      ) : (
        <div data-testid="empty-state" className="rounded border p-6">
          No jobs yet — check back soon.
        </div>
      )}
    </main>
  );
}


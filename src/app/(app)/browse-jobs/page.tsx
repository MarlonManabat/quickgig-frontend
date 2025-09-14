// Simple browse page that satisfies smoke tests:
// Expose either data-testid="jobs-list" or "empty-state".
export default async function BrowseJobsPage() {
  // TODO: replace with real data fetch
  const jobs: Array<{ id: string; title: string }> = [];

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mb-4">Browse Jobs</h1>

      {jobs.length === 0 ? (
        <div data-testid="empty-state" className="text-sm text-neutral-500">
          No jobs yet. Check back soon.
        </div>
      ) : (
        <ul data-testid="jobs-list" className="space-y-2">
          {jobs.map((j) => (
            <li key={j.id} className="border rounded p-3">
              {j.title}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}


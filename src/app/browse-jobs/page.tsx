export default async function BrowseJobsPage() {
  // Until the API is wired, render an explicit empty state or list container.
  // The smoke test passes if either #jobs-list OR #empty-state is visible.
  const jobs: any[] = [];
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Browse Jobs</h1>
      {jobs.length === 0 ? (
        <div data-testid="empty-state" className="text-gray-600">No jobs yet.</div>
      ) : (
        <ul data-testid="jobs-list" className="grid gap-4"></ul>
      )}
    </main>
  );
}


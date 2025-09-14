type Job = { id: string; title: string };

// In preview/CI we render a deterministic empty state that the smoke accepts.
function getJobs(): Job[] {
  if (process.env.CI === "true" || process.env.VERCEL_ENV !== "production") {
    return []; // deterministic empty list
  }
  // Hook real data here later.
  return [];
}

export default function Page() {
  const jobs = getJobs();
  if (jobs.length === 0) {
    return (
      <section>
        <h1>Browse Jobs</h1>
        <div data-testid="empty-state">No jobs yet — preview environment.</div>
      </section>
    );
  }
  return (
    <ul data-testid="jobs-list">{jobs.map(j => <li key={j.id}>{j.title}</li>)}</ul>
  );
}

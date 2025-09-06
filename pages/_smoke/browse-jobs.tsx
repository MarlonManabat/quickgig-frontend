export default function BrowseJobsSmoke() {
  return (
    <main>
      <div data-testid="jobs-list">
        <article data-testid="job-card"><a href="/jobs/mock-1">Sample Job A</a></article>
        <article data-testid="job-card"><a href="/jobs/mock-2">Sample Job B</a></article>
      </div>
    </main>
  );
}

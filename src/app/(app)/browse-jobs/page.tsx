export default function BrowseJobsPage() {
  return (
    <section>
      <h1 className="text-xl font-semibold mb-4">Browse jobs</h1>
      <ul id="jobs-list" data-testid="jobs-list">
        {/* Empty list tolerated by smoke */}
      </ul>
    </section>
  );
}

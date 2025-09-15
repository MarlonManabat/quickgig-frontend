export default function Page() {
  // Minimal contract: show either jobs-list or empty-state. Start with empty-state.
  return (
    <section className="mx-auto max-w-5xl p-8">
      <div data-testid="empty-state">No jobs yet — check back soon.</div>
    </section>
  );
}

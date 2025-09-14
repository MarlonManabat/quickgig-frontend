// When authed, this can render the list; while unauthenticated, middleware will redirect.
export default function ApplicationsPage() {
  return (
    <section style={{ padding: 24 }}>
      <h1>My Applications</h1>
      <div data-testid="applications-empty">No applications yet</div>
    </section>
  );
}

export default function Page() {
  // When authed, the smoke accepts an empty state.
  return (
    <section className="mx-auto max-w-5xl p-8">
      <div data-testid="empty-state">You have no applications yet.</div>
    </section>
  );
}

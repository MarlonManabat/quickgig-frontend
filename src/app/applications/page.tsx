export default function ApplicationsPage() {
  return (
    <section>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>My Applications</h2>
      <p data-testid="applications-empty" style={{ color: "#6b7280" }}>
        You have no applications yet.
      </p>
    </section>
  );
}

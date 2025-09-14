export default function PostJobPlaceholderPage() {
  return (
    <section>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>Post a job</h2>
      {/* Keep wording so tests can match 'Post a job' text on this page only */}
      <div
        data-testid="post-job-skeleton"
        style={{
          border: "1px solid #e5e7eb",
          padding: 16,
          borderRadius: 8,
          background: "#fafafa",
        }}
      >
        Post a job placeholder
      </div>
    </section>
  );
}

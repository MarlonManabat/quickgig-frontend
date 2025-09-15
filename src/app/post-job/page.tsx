export default function PostJobPlaceholder() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* Keep this exact text for the smoke check */}
      <h1 className="text-2xl font-semibold mb-4">Post a job</h1>
      <div data-testid="post-job-skeleton" className="rounded-lg border p-6 text-gray-600">
        This is a placeholder. Posting will be enabled after wiring the app host flow.
      </div>
    </main>
  );
}


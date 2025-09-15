export default function CreateGigPlaceholder() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Create a gig</h1>
      {/** Intentionally avoid the text “Post a job” here to prevent strict-mode duplication */}
      <div data-testid="post-job-skeleton" className="mt-4 text-gray-600">
        Employer flow placeholder
      </div>
    </main>
  );
}

export default function Page() {
  // Keep the phrase "Post a job" here, but the header hides its own link on this route
  // to avoid Playwright strict-mode double match.
  return (
    <section className="mx-auto max-w-5xl p-8">
      <div data-testid="post-job-skeleton" aria-busy="true">Post a job placeholder</div>
    </section>
  );
}

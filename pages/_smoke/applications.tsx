export default function ApplicationsSmoke() {
  return (
    <section>
      <div data-testid="applications-list"></div>
      <div data-qa="applications-empty">
        <a data-cta="browse-jobs-from-empty" href="/browse-jobs">Browse Jobs</a>
      </div>
    </section>
  );
}

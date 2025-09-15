import Link from "next/link";

export default function Page() {
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-2">Browse gigs</h1>
      <p className="mb-6">Find your next gig fast.</p>
      <Link
        href="/browse-jobs"
        data-testid="hero-start"
        className="inline-block border rounded px-4 py-2"
        aria-label="Start browsing gigs"
      >
        Start now
      </Link>
      {/* Minimal placeholder list to keep page non-empty */}
      <div className="mt-8" data-testid="jobs-list">No jobs yet.</div>
    </section>
  );
}

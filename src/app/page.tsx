import Link from "next/link";

export default function LandingPage() {
  return (
    <section style={{ maxWidth: 880, margin: "40px auto" }}>
      <h1 style={{ fontSize: 32, marginBottom: 12 }}>Find gigs. Hire fast.</h1>
      <p style={{ color: "#4b5563", marginBottom: 24 }}>
        QuickGig makes posting and finding short-term work simple. This is a lightweight
        marketing landing that returns 200 for smoke tests.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link data-testid="cta-browse-jobs" href="/browse-jobs">
          Browse Jobs
        </Link>
        <Link data-testid="cta-post-job" href="/post-job">
          Post a job
        </Link>
        <Link data-testid="cta-my-applications" href="/applications">
          My Applications
        </Link>
      </div>
    </section>
  );
}

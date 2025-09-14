import Link from "next/link";

export default function Landing() {
  return (
    <section>
      <h1>Find flexible work fast</h1>
      <p>Welcome to QuickGig.</p>
      <div className="mt-4 flex gap-3">
        <Link href="/browse-jobs" data-testid="hero-start">Start browsing</Link>
      </div>
    </section>
  );
}

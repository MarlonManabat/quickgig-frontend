import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section data-testid="hero-start" className="rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-2">Find gigs fast.</h1>
        <p className="mb-4">Browse short-term jobs and apply in minutes.</p>
        <Link
          href="/browse-jobs"
          data-testid="hero-browse-cta"
          className="inline-block rounded bg-black px-4 py-2 text-white"
        >
          Browse Jobs
        </Link>
      </section>
    </main>
  );
}


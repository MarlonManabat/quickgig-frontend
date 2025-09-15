export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <section className="rounded-2xl bg-gray-100 p-10 text-center">
        <h1 className="text-3xl font-bold">Find gigs fast</h1>
        <p className="mt-2 text-gray-600">
          Browse fresh jobs and apply in minutes.
        </p>
        <a
          data-testid="hero-start"
          href="/browse-jobs"
          className="mt-6 inline-block rounded bg-blue-600 px-5 py-2 text-white"
        >
          Start browsing
        </a>
      </section>
    </main>
  );
}

import { hostAware } from '@/lib/hostAware';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <section className="rounded-2xl bg-gray-100 p-10 text-center">
        <h1 className="text-3xl font-bold">Find gigs fast</h1>
        <p className="mt-2 text-gray-600">
          Browse fresh jobs and apply in minutes.
        </p>
        {/* Primary CTA → must navigate to /browse-jobs for smoke */}
        <a
          data-testid="hero-start"
          href="/browse-jobs"
          className="mt-6 inline-block rounded bg-blue-600 px-5 py-2 text-white"
        >
          Browse jobs
        </a>

        {/* App CTAs that should open on the App Host (absolute when configured) */}
        <div className="mt-8 flex gap-4">
          <a
            data-testid="app-cta-post-job"
            className="underline"
            href={hostAware('/gigs/create')}
            rel="noopener"
          >
            Post a job
          </a>
          <a
            data-testid="app-cta-my-applications"
            className="underline"
            href={hostAware('/applications')}
            rel="noopener"
          >
            My Applications
          </a>
        </div>
      </section>
    </main>
  );
}

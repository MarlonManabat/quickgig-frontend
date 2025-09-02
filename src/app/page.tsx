import Link from 'next/link';
import { ROUTES } from '../lib/routes';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-6 text-center">
      <h1 className="text-3xl font-semibold mb-4">Find work. Hire talent.</h1>
      <p className="mb-6 text-slate-600">Quick gigs for everyone.</p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href={ROUTES.browseJobs}
          prefetch={false}
          data-testid="hero-browse-jobs"
          className="rounded-lg bg-black text-white px-5 py-2"
        >
          Browse jobs
        </Link>

        <Link
          href={ROUTES.postJob}
          prefetch={false}
          data-testid="hero-post-job"
          className="rounded-lg border px-5 py-2"
        >
          Post a job
        </Link>
      </div>
    </main>
  );
}

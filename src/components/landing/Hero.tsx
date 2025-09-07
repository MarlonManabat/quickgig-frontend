import Link from 'next/link';
import { CTA_TARGET } from '@/lib/navMap';

export default function LandingHero() {
  return (
    <section className="...">
      <div className="flex gap-3">
        <Link
          href={CTA_TARGET['hero-browse-jobs']}
          data-testid="hero-browse-jobs"
          data-cta="hero-browse-jobs"
          className="px-4 py-2 rounded-md bg-gray-100"
        >
          Browse jobs
        </Link>
        <Link
          href={CTA_TARGET['hero-post-job']}
          data-testid="hero-post-job"
          data-cta="hero-post-job"
          className="px-4 py-2 rounded-md bg-blue-600 text-white"
        >
          Post a job
        </Link>
      </div>
    </section>
  );
}

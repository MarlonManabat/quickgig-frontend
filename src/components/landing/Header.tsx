import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { CTA_TARGET } from '@/lib/navMap';

export default function LandingHeader() {
  return (
    <nav className="...">
      <Link
        data-testid="nav-browse-jobs"
        data-cta="nav-browse-jobs"
        href={CTA_TARGET['nav-browse-jobs']}
        className="hover:underline"
      >
        Browse jobs
      </Link>
      <Link
        data-testid="nav-post-job"
        data-cta="nav-post-job"
        href={CTA_TARGET['nav-post-job']}
        className="btn btn-primary"
      >
        Post a job
      </Link>
      <Link
        data-testid="nav-my-applications"
        data-cta="nav-my-applications"
        href={CTA_TARGET['nav-my-applications']}
        className="..."
      >
        My Applications
      </Link>
      <Link data-testid="nav-login" data-cta="nav-login" href={ROUTES.login} className="...">
        Sign in
      </Link>
      <button type="button" data-testid="nav-menu-button" aria-label="Open menu" className="md:hidden">
        Menu
      </button>
    </nav>
  );
}

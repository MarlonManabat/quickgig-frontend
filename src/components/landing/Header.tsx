import LinkApp from '@/components/LinkApp';
import { ROUTES } from '@/lib/routes';

export default function LandingHeader() {
  return (
    <nav className="...">
      <LinkApp
        data-testid="nav-browse-jobs"
        href={ROUTES.browseJobs}
        className="hover:underline"
      >
        Browse jobs
      </LinkApp>
      <LinkApp
        data-testid="nav-post-job"
        href={ROUTES.postJob}
        className="btn btn-primary"
      >
        Post a job
      </LinkApp>
      <LinkApp
        data-testid="nav-my-applications"
        href={ROUTES.applications}
        className="..."
      >
        My Applications
      </LinkApp>
      <LinkApp data-testid="nav-login" href={ROUTES.login} className="...">
        Sign in
      </LinkApp>
    </nav>
  );
}

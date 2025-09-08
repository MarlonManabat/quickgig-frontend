import { ROUTES } from '@/lib/routes';

export default function Page() {
  return (
    <main>
      <nav>
        <a data-testid="nav-browse-jobs" data-cta="nav-browse-jobs" href={ROUTES.browseJobs}>Browse jobs</a>
        <a
          data-testid="nav-post-job"
          data-cta="nav-post-job"
          href={`${ROUTES.login}?next=${encodeURIComponent(ROUTES.postJob)}`}
        >
          Post a job
        </a>
        <a
          data-testid="nav-my-applications"
          data-cta="nav-my-applications"
          href={`${ROUTES.login}?next=${encodeURIComponent(ROUTES.applications)}`}
        >
          My Applications
        </a>
        <a
          data-testid="nav-tickets"
          data-cta="nav-tickets"
          href={`${ROUTES.login}?next=${encodeURIComponent(ROUTES.tickets)}`}
        >
          Tickets
        </a>
        <a data-testid="nav-login" data-cta="nav-login" href={`${ROUTES.login}?next=${encodeURIComponent(ROUTES.browseJobs)}`}>Login</a>
      </nav>

      <ul data-testid="jobs-list">
        {[1,2,3].map(i => (
          <li key={i} data-testid="job-card">
            <h3>Mock Job {i}</h3>
            <a data-testid="apply-button" href={`${ROUTES.login}?next=${ROUTES.applications}`}>Apply</a>
          </li>
        ))}
      </ul>
    </main>
  );
}

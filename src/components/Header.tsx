import { authAware } from '@/lib/hostAware';

export default function Header() {
  return (
    <header className="w-full border-b">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <a href="/" className="font-semibold">QuickGig</a>
        <div className="flex items-center gap-4">
          <a data-testid="nav-browse-jobs" href="/browse-jobs">Browse Jobs</a>
          <a data-testid="nav-my-applications" href="/my-applications">My Applications</a>
          <a data-testid="nav-login" href="/login">Login</a>
          {/* App-host action */}
          <a
            data-testid="nav-post-job"
            href={authAware('/gigs/create')}
            rel="noopener"
          >
            Post a job
          </a>
        </div>
      </nav>
    </header>
  );
}

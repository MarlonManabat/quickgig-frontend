import { isAuthedServer } from "@/lib/auth/isAuthedServer";
import { authAware, hostAware } from "@/lib/hostAware";

export default function Header() {
  const authed = isAuthedServer();
  const postHref = authed
    ? hostAware("/gigs/create")
    : authAware("/gigs/create");
  const logoutHref = hostAware("/api/logout?next=/");
  const loginHref = hostAware("/login");

  return (
    <header className="w-full border-b">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <a href="/" className="font-semibold">QuickGig</a>
        <div className="flex items-center gap-4">
          <a data-testid="nav-browse-jobs" href="/browse-jobs">Browse Jobs</a>
          <a data-testid="nav-my-applications" href="/my-applications">My Applications</a>
          {authed ? (
            <a data-testid="nav-logout" href={logoutHref}>
              Logout
            </a>
          ) : (
            <a data-testid="nav-login" href={loginHref}>
              Login
            </a>
          )}
          {/* App-host action */}
          <a data-testid="nav-post-job" href={postHref} rel="noopener">
            Post a job
          </a>
        </div>
      </nav>
    </header>
  );
}

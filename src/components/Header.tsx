import { isAuthedServer } from "@/lib/auth/isAuthedServer";
import { authAware, hostAware } from "@/lib/hostAware";
import TicketCounter from "./TicketCounter";

export default function Header() {
  const authed = isAuthedServer();
  const postHref = authed
    ? hostAware("/gigs/create")
    : authAware("/gigs/create");
  const logoutHref = hostAware("/api/auth/logout?next=/");
  const loginHref = hostAware("/login");
  const myApplicationsHref = authed
    ? hostAware("/my-applications")
    : authAware("/my-applications");

  return (
    <header className="w-full border-b">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <a href="/" className="font-semibold text-teal-600 text-xl">QuickGig</a>
          <span className="text-sm text-gray-500">Find gigs fast</span>
        </div>
        <div className="flex items-center gap-4">
          <a data-testid="nav-browse-jobs" href="/browse-jobs" className="hover:text-teal-600">Browse Jobs</a>
          <a data-testid="nav-my-applications" href={myApplicationsHref} className="hover:text-teal-600">
            My Applications
          </a>
          {authed && (
            <a data-testid="nav-messages" href="/messages" className="hover:text-teal-600">
              Messages
            </a>
          )}
          <TicketCounter isAuthenticated={authed} />
          {authed ? (
            <a data-testid="nav-logout" href={logoutHref} className="hover:text-teal-600">
              Logout
            </a>
          ) : (
            <a data-testid="nav-login" href={loginHref} className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-black font-medium">
              Login
            </a>
          )}
          {/* App-host action */}
          <a data-testid="nav-post-job" href={postHref} rel="noopener" className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded font-medium">
            Post a job
          </a>
        </div>
      </nav>
    </header>
  );
}

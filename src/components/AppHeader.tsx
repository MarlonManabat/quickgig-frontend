'use client';

import LinkApp from '@/components/LinkApp';
import { useUser } from '@/hooks/useUser';
import { ROUTES } from '@/app/lib/routes';

type Props = {
  balance: number;
};

export default function AppHeader({ balance }: Props) {
  const { user, signOut } = useUser();
  return (
    <header data-testid="app-header" className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <LinkApp href="/" className="font-semibold">
            QuickGig
          </LinkApp>
          <nav className="flex items-center gap-4">
            <LinkApp data-testid="nav-browse-jobs" href={ROUTES.BROWSE_JOBS} prefetch={false}>
              Browse jobs
            </LinkApp>
            <LinkApp data-testid="nav-post-job" href={ROUTES.GIGS_CREATE} prefetch={false}>
              Post a job
            </LinkApp>
            <LinkApp
              data-testid="nav-my-applications"
              href={ROUTES.APPLICATIONS}
              prefetch={false}
            >
              My Applications
            </LinkApp>
            {user ? (
              <button onClick={() => signOut()} className="underline">
                Sign out
              </button>
            ) : (
              <LinkApp href={ROUTES.LOGIN} className="underline">
                Sign in
              </LinkApp>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl border px-2 py-1 text-sm" title="Tickets">
            🎟️ {balance}
          </span>
          <LinkApp
            href="/billing/tickets?next=/gigs/create"
            className="border rounded-xl px-3 py-1 text-sm"
          >
            Buy ticket
          </LinkApp>
        </div>
      </div>
    </header>
  );
}

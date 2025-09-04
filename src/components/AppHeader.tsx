'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import LinkApp from '@/components/LinkApp';
import { ROUTES } from '@/lib/routes';

type Props = {
  balance: number;
};

export default function AppHeader({ balance }: Props) {
  const { user, signOut } = useUser();
  return (
    <header data-testid="app-header" className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            QuickGig
          </Link>
          <nav className="flex items-center gap-4">
            <LinkApp data-testid="nav-browse-jobs" href={ROUTES.browseJobs} prefetch={false}>
              Browse jobs
            </LinkApp>
            <LinkApp href={ROUTES.gigsCreate} data-testid="nav-post-job" prefetch={false}>
              Post a job
            </LinkApp>
            <LinkApp
              href={ROUTES.applications}
              data-testid="nav-my-applications"
              prefetch={false}
            >
              My Applications
            </LinkApp>
            {user ? (
              <button onClick={() => signOut()} className="underline">
                Sign out
              </button>
            ) : (
              <Link href="/login" className="underline">
                Sign in
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl border px-2 py-1 text-sm" title="Tickets">
            🎟️ {balance}
          </span>
          <Link
            href="/billing/tickets?next=/gigs/create"
            className="border rounded-xl px-3 py-1 text-sm"
          >
            Buy ticket
          </Link>
        </div>
      </div>
    </header>
  );
}

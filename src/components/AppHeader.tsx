'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { ROUTES } from '../lib/routes';

type Props = {
  balance: number;
};

export default function AppHeader({ balance }: Props) {
  const { user, signOut } = useUser();
  const [open, setOpen] = useState(false);
  return (
    <header data-testid="app-header" className="border-b bg-white/60 backdrop-blur">
      <div className="container mx-auto max-w-full sm:max-w-screen-lg px-4 flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            QuickGig
          </Link>
          <nav className="hidden sm:flex items-center gap-4">
            <Link data-testid="nav-browse-jobs" href={ROUTES.browseJobs} prefetch={false}>
              Browse jobs
            </Link>
            <Link href={ROUTES.postJob} prefetch={false}>Post a job</Link>
            <Link
              data-testid="nav-my-applications"
              href={ROUTES.myApplications}
              prefetch={false}
            >
              My Applications
            </Link>
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
          <span className="hidden sm:inline-flex rounded-xl border px-2 py-1 text-sm" title="Tickets">
            🎟️ {balance}
          </span>
          <Link
            href="/billing/tickets?next=/gigs/create"
            className="border rounded-xl px-3 py-1 text-sm"
          >
            Buy ticket
          </Link>
          <button
            className="sm:hidden p-2"
            aria-label="Menu"
            data-testid="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="sm:hidden border-t">
          <nav className="container mx-auto max-w-full px-4 py-3 flex flex-col gap-3">
            <Link data-testid="nav-browse-jobs" href={ROUTES.browseJobs} prefetch={false}>
              Browse jobs
            </Link>
            <Link href={ROUTES.postJob} prefetch={false}>Post a job</Link>
            <Link
              data-testid="nav-my-applications"
              href={ROUTES.myApplications}
              prefetch={false}
            >
              My Applications
            </Link>
            {user ? (
              <button onClick={() => signOut()} className="text-left underline">
                Sign out
              </button>
            ) : (
              <Link href="/login" className="underline">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

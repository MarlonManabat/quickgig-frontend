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

  const links = [
    { href: ROUTES.browseJobs, label: 'Browse jobs', testId: 'nav-browse-jobs' },
    { href: ROUTES.postJob, label: 'Post a job' },
    { href: ROUTES.myApplications, label: 'My Applications', testId: 'nav-my-applications' },
    user
      ? { label: 'Sign out', onClick: () => signOut() }
      : { href: '/login', label: 'Sign in' },
    { href: '/billing/tickets?next=/gigs/create', label: 'Buy ticket' },
  ];

  return (
    <header
      data-testid="app-header"
      className="sticky safe-top top-0 z-50 border-b bg-white/80 backdrop-blur"
    >
      <div className="mx-auto flex h-14 max-w-screen-md items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold">
          QuickGig
        </Link>
        <div className="flex items-center gap-3">
          <span className="rounded-xl border px-2 py-1 text-sm" title="Tickets">
            🎟️ {balance}
          </span>
          <nav className="hidden items-center gap-4 md:flex">
            {links.map((l, i) =>
              'href' in l ? (
                <Link
                  key={i}
                  href={l.href}
                  prefetch={false}
                  data-testid={l.testId}
                  className="hover:underline"
                >
                  {l.label}
                </Link>
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={l.onClick}
                  className="hover:underline"
                >
                  {l.label}
                </button>
              )
            )}
          </nav>
          <button
            type="button"
            className="border px-3 py-2 md:hidden rounded"
            aria-controls="mobile-nav"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            Menu
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          role="navigation"
          className="md:hidden grid gap-1 border-t bg-white/80 backdrop-blur p-3 safe-bottom"
        >
          {links.map((l, i) =>
            'href' in l ? (
              <Link
                key={i}
                href={l.href}
                prefetch={false}
                data-testid={l.testId}
                className="block min-h-11 rounded-lg px-2"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => {
                  l.onClick();
                  setOpen(false);
                }}
                className="block text-left min-h-11 rounded-lg px-2"
              >
                {l.label}
              </button>
            )
          )}
        </nav>
      )}
    </header>
  );
}

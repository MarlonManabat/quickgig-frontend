'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import LinkApp from '@/components/LinkApp';
import { ROUTES } from '@/lib/routes';

type Props = {
  balance: number;
};

export default function AppHeader({ balance }: Props) {
  const { user, signOut } = useUser();
  const [open, setOpen] = useState(false);

  const baseLinks = [
    {
      href: ROUTES.browseJobs,
      label: 'Browse jobs',
      testId: 'nav-browse-jobs',
      mobileId: 'navm-browse-jobs',
    },
    {
      href: ROUTES.gigsCreate,
      label: 'Post a job',
      testId: 'nav-post-job',
      mobileId: 'navm-post-job',
    },
    {
      href: ROUTES.applications,
      label: 'My Applications',
      testId: 'nav-my-applications',
      mobileId: 'navm-my-applications',
    },
  ];
  const authLinks = user
    ? [
        {
          label: 'Sign out',
          onClick: () => signOut(),
          testId: 'nav-logout',
          mobileId: 'navm-logout',
        },
      ]
    : [
        {
          href: ROUTES.login,
          label: 'Sign in',
          testId: 'nav-login',
          mobileId: 'navm-login',
        },
      ];
  const links = [...baseLinks, ...authLinks];

  return (
    <header data-testid="app-header" className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <LinkApp href={ROUTES.browseJobs} className="font-semibold">
            QuickGig
          </LinkApp>
          <nav className="hidden md:flex items-center gap-4">
            {links.map(link =>
              link.href ? (
                <LinkApp
                  key={link.testId}
                  data-testid={link.testId}
                  href={link.href}
                  prefetch={false}
                >
                  {link.label}
                </LinkApp>
              ) : (
                <button
                  key={link.testId}
                  data-testid={link.testId}
                  onClick={link.onClick}
                  className="underline"
                >
                  {link.label}
                </button>
              ),
            )}
          </nav>
          <button
            data-testid="navm-toggle"
            className="md:hidden"
            onClick={() => setOpen(o => !o)}
          >
            Menu
          </button>
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
      {open && (
        <nav className="md:hidden flex flex-col gap-2 p-4 border-t">
          {links.map(link =>
            link.href ? (
              <LinkApp
                key={link.mobileId}
                data-testid={link.mobileId}
                href={link.href}
                prefetch={false}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </LinkApp>
            ) : (
              <button
                key={link.mobileId}
                data-testid={link.mobileId}
                onClick={() => {
                  setOpen(false);
                  link.onClick();
                }}
                className="underline text-left"
              >
                {link.label}
              </button>
            ),
          )}
        </nav>
      )}
    </header>
  );
}

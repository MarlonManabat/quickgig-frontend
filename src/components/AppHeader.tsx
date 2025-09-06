'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import LinkApp from '@/components/LinkApp';
import { NAV_ITEMS, ROUTES } from '@/lib/routes';
import dynamic from 'next/dynamic';
import { isAdmin } from '@/lib/admin';

const TicketBalanceChip = dynamic(() => import('@/components/TicketBalanceChip'), { ssr: false });

export default function AppHeader() {
  const { user, signOut } = useUser();
  const [open, setOpen] = useState(false);

  const links = NAV_ITEMS.filter(item => !(user && item.key === 'login')).map(
    item => ({
      href: item.to,
      label: item.label,
      testId: item.idDesktop,
      mobileId: item.idMobile,
    }),
  );
  if (user) {
    if (isAdmin(user.email)) {
      links.push({
        href: ROUTES.adminTickets,
        label: 'Admin · Tickets',
        testId: 'nav-admin-tickets',
        mobileId: 'navm-admin-tickets',
      });
    }
    links.push({
      label: 'Sign out',
      onClick: () => signOut(),
      testId: 'nav-logout',
      mobileId: 'navm-logout',
    });
  }

  return (
    <header data-testid="app-header" className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <LinkApp
            href={ROUTES.browseJobs}
            className="font-semibold"
            data-cta="nav-browse-jobs"
          >
            QuickGig
          </LinkApp>
          <nav className="hidden md:flex items-center gap-4">
            {links.map(link =>
              link.href ? (
                <LinkApp
                  key={link.testId}
                  data-testid={link.testId}
                  data-cta={link.testId}
                  href={link.href}
                  prefetch={false}
                >
                  {link.label}
                </LinkApp>
              ) : (
                <button
                  key={link.testId}
                  data-testid={link.testId}
                  data-cta={link.testId}
                  onClick={link.onClick}
                  className="underline"
                >
                  {link.label}
                </button>
              ),
            )}
          </nav>
          <button
            data-testid="nav-menu-button"
            aria-expanded={open}
            aria-controls="nav-menu"
            className="md:hidden"
            onClick={() => setOpen(o => !o)}
          >
            Menu
          </button>
        </div>
        <div className="flex items-center gap-3">
          <TicketBalanceChip />
          <LinkApp
            href={`${ROUTES.billingTickets}?next=${encodeURIComponent(ROUTES.postJob)}`}
            className="border rounded-xl px-3 py-1 text-sm"
          >
            Buy ticket
          </LinkApp>
        </div>
      </div>
      {open ? (
        <div
          id="nav-menu"
          data-testid="nav-menu"
          role="dialog"
          aria-modal="true"
          className="md:hidden border-t bg-white"
        >
          <div className="flex flex-col gap-2 p-4">
            {links.map(link =>
              link.href ? (
                <LinkApp
                  key={link.mobileId}
                  data-testid={link.mobileId}
                  data-cta={link.mobileId}
                  href={link.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="link"
                >
                  {link.label}
                </LinkApp>
              ) : (
                <button
                  key={link.mobileId}
                  data-testid={link.mobileId}
                  data-cta={link.mobileId}
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
          </div>
        </div>
      ) : null}
    </header>
  );
}

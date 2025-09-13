'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';
import { NAV_ITEMS, ROUTES } from '@/lib/routes';
import dynamic from 'next/dynamic';
import { isAdmin } from '@/lib/admin';
import { loginNext } from '@/app/lib/authAware';

const TicketBalanceChip = dynamic(() => import('@/components/TicketBalanceChip'), { ssr: false });

export default function AppHeader() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const links = NAV_ITEMS.filter(item => !(user && item.key === 'login')).map(item => ({
    href: item.to,
    label: item.label,
    testIdDesktop: item.idDesktop,
    testIdMobile: item.idMobile,
  }));
  if (user) {
    if (isAdmin(user.email)) {
      links.push({
        href: ROUTES.adminTickets,
        label: 'Admin · Tickets',
        testId: 'nav-admin-tickets',
      });
    }
    links.push({
      href: ROUTES.logout,
      label: 'Sign out',
      testId: 'nav-logout',
    });
  }

  return (
    <header data-testid="app-header" className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link href={ROUTES.home} className="font-semibold">
            QuickGig
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {links.map(link =>
              link.href ? (
                <Link
                  key={link.testIdDesktop}
                  data-testid={link.testIdDesktop}
                  data-cta={link.testIdDesktop}
                  href={link.href}
                  prefetch={false}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.testIdDesktop}
                  data-testid={link.testIdDesktop}
                  data-cta={link.testIdDesktop}
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
          <Link
            href={user ? ROUTES.ticketsBuy : loginNext(ROUTES.ticketsBuy)}
            data-cta="nav-buy-ticket"
            className="border rounded-xl px-3 py-1 text-sm"
          >
            Buy ticket
          </Link>
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
                <Link
                  key={link.testIdMobile}
                  data-testid={link.testIdMobile}
                  data-cta={link.testIdMobile}
                  href={link.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="link"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.testIdMobile}
                  data-testid={link.testIdMobile}
                  data-cta={link.testIdMobile}
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

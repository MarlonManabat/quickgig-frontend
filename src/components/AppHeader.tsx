'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import dynamic from 'next/dynamic';
import { isAdmin } from '@/lib/admin';
import { navLinks } from '@/nav/links';
import { loginNext } from '@/app/lib/authAware';

const TicketBalanceChip = dynamic(() => import('@/components/TicketBalanceChip'), { ssr: false });

export default function AppHeader() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const links = navLinks(!!user).filter(item => !(user && item.id === 'login'));
  if (user) {
    if (isAdmin(user.email)) {
      links.push({
        id: 'admin-tickets',
        label: 'Admin · Tickets',
        href: ROUTES.adminTickets,
        testId: 'nav-admin-tickets',
      });
    }
    links.push({
      id: 'logout',
      label: 'Sign out',
      href: ROUTES.logout,
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
            {links.map(link => (
              <Link
                key={link.id}
                data-testid={link.testId}
                data-cta={link.testId}
                href={link.href}
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
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
            {links.map(link => (
              <Link
                key={link.id}
                data-testid={link.testId}
                data-cta={link.testId}
                href={link.href}
                prefetch={false}
                onClick={() => setOpen(false)}
                className="link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

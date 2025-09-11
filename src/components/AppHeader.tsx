'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';
import { ROUTES, toAppPath } from '@/lib/routes';
import dynamic from 'next/dynamic';
import { isAdmin } from '@/lib/admin';
import { loginNext } from '@/app/lib/authAware';

const TicketBalanceChip = dynamic(() => import('@/components/TicketBalanceChip'), { ssr: false });

export default function AppHeader() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <header data-testid="app-header" className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link href={ROUTES.home} className="font-semibold">
            QuickGig
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              data-testid="nav-browse-jobs"
              data-cta="nav-browse-jobs"
              href={ROUTES.browseJobs}
              prefetch={false}
            >
              Browse jobs
            </Link>
            <Link
              data-testid="nav-post-job"
              data-cta="nav-post-job"
              href={toAppPath(loginNext(ROUTES.postJobs))}
              prefetch={false}
            >
              Post a job
            </Link>
            <Link
              data-testid="nav-my-applications"
              data-cta="nav-my-applications"
              href={loginNext(ROUTES.applications)}
              prefetch={false}
            >
              My Applications
            </Link>
            <Link
              data-testid="nav-tickets"
              data-cta="nav-tickets"
              href={ROUTES.tickets}
              prefetch={false}
            >
              Tickets
            </Link>
            {!user && (
              <Link
                data-testid="nav-login"
                data-cta="nav-login"
                href={loginNext(ROUTES.browseJobs)}
                prefetch={false}
              >
                Login
              </Link>
            )}
            {user && isAdmin(user.email) && (
              <Link
                data-testid="nav-admin-tickets"
                data-cta="nav-admin-tickets"
                href={ROUTES.adminTickets}
                prefetch={false}
              >
                Admin · Tickets
              </Link>
            )}
            {user && (
              <Link
                data-testid="nav-logout"
                data-cta="nav-logout"
                href={ROUTES.logout}
                prefetch={false}
              >
                Sign out
              </Link>
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
            <Link
              data-testid="nav-browse-jobs"
              data-cta="nav-browse-jobs"
              href={ROUTES.browseJobs}
              prefetch={false}
              onClick={() => setOpen(false)}
              className="link"
            >
              Browse jobs
            </Link>
            <Link
              data-testid="nav-post-job"
              data-cta="nav-post-job"
              href={toAppPath(loginNext(ROUTES.postJobs))}
              prefetch={false}
              onClick={() => setOpen(false)}
              className="link"
            >
              Post a job
            </Link>
            <Link
              data-testid="nav-my-applications"
              data-cta="nav-my-applications"
              href={loginNext(ROUTES.applications)}
              prefetch={false}
              onClick={() => setOpen(false)}
              className="link"
            >
              My Applications
            </Link>
            <Link
              data-testid="nav-tickets"
              data-cta="nav-tickets"
              href={ROUTES.tickets}
              prefetch={false}
              onClick={() => setOpen(false)}
              className="link"
            >
              Tickets
            </Link>
            {!user && (
              <Link
                data-testid="nav-login"
                data-cta="nav-login"
                href={loginNext(ROUTES.browseJobs)}
                prefetch={false}
                onClick={() => setOpen(false)}
                className="link"
              >
                Login
              </Link>
            )}
            {user && isAdmin(user.email) && (
              <Link
                data-testid="nav-admin-tickets"
                data-cta="nav-admin-tickets"
                href={ROUTES.adminTickets}
                prefetch={false}
                onClick={() => setOpen(false)}
                className="link"
              >
                Admin · Tickets
              </Link>
            )}
            {user && (
              <Link
                data-testid="nav-logout"
                data-cta="nav-logout"
                href={ROUTES.logout}
                prefetch={false}
                onClick={() => setOpen(false)}
                className="link"
              >
                Sign out
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

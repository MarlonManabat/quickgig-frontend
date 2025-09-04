'use client';
import { useState } from 'react';
import LinkApp from '@/components/LinkApp';
import { ROUTES } from '@/lib/routes';

type NavLinksProps = { prefix: string };
const NavLinks = ({ prefix }: NavLinksProps) => (
  <nav className="flex flex-col md:flex-row gap-3 md:gap-6">
    <LinkApp
      data-testid={`${prefix}browse-jobs`}
      href={ROUTES.browseJobs}
      className="link"
    >
      Browse jobs
    </LinkApp>
    <LinkApp
      data-testid={`${prefix}post-job`}
      href={ROUTES.postJob}
      className="link"
    >
      Post a job
    </LinkApp>
    <LinkApp
      data-testid={`${prefix}my-applications`}
      href={ROUTES.applications}
      className="link"
    >
      My Applications
    </LinkApp>
    <LinkApp
      data-testid={`${prefix}login`}
      href={ROUTES.login}
      className="link"
    >
      Sign in
    </LinkApp>
  </nav>
);

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <LinkApp href={ROUTES.browseJobs} className="font-semibold">QuickGig</LinkApp>
        {/* Desktop nav */}
        <div className="hidden md:block">
          <NavLinks prefix="nav-" />
        </div>
        {/* Mobile menu button (no duplicate links when closed) */}
        <button
          type="button"
          className="md:hidden p-2 -mr-2"
          aria-label="Open menu"
          aria-expanded={open}
          data-testid="nav-menu-button"
          onClick={() => setOpen(v => !v)}
        >
          ☰
        </button>
      </div>
      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t">
          <div className="px-4 py-3">
            <NavLinks prefix="navm-" />
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState } from 'react';

import type { Session } from '@/lib/auth';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    id: 'nav-browse-jobs',
    href: '/browse-jobs',
    label: 'Maghanap ng Trabaho',
  },
  {
    id: 'nav-my-applications',
    href: '/applications',
    label: 'Aking Mga Application',
  },
];

type HeaderProps = {
  session: Session | null;
  postJobHref: string;
};

export function Header({ session, postJobHref }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const authHref = session ? `/api/auth/logout?next=${encodeURIComponent(pathname ?? '/browse-jobs')}` : '/login';
  const authId = session ? 'nav-logout' : 'nav-login';
  const authLabel = session ? 'Mag-logout' : 'Mag-login';

  const NavLinks = () => (
    <>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.id}
          href={session ? item.href : `/login?next=${encodeURIComponent(item.href)}`}
          data-testid={item.id}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
      <Link
        href={postJobHref}
        data-testid="nav-post-job"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Mag-post ng Gig
      </Link>
      <Link
        href={authHref}
        data-testid={authId}
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        {authLabel}
      </Link>
    </>
  );

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/browse-jobs" className="text-lg font-semibold" data-testid="hero-start">
          QuickGig.ph
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLinks />
        </nav>
        <button
          type="button"
          className="md:hidden"
          aria-label="Toggle navigation"
          data-testid="nav-menu-button"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      <div
        data-testid="nav-menu"
        className={cn('border-t border-border bg-background px-6 py-4 md:hidden', open ? 'block' : 'hidden')}
      >
        <div className="flex flex-col gap-4">
          <NavLinks />
        </div>
      </div>
    </header>
  );
}

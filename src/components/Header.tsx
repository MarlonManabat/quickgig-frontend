'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function hasAuthCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c.trim().startsWith('qg_auth=1'));
}

function appHost(): string {
  const raw = process.env.NEXT_PUBLIC_APP_HOST || '';
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

export default function Header() {
  const [authed, setAuthed] = useState(false);
  const pathname = usePathname();
  const onPostJobPage = pathname?.startsWith('/post-job');

  useEffect(() => {
    // Read cookie client-side so Playwright can flip it during the run.
    setAuthed(hasAuthCookie());
  }, []);

  return (
    <header className="w-full border-b">
      <nav className="mx-auto max-w-5xl p-3 flex items-center gap-4">
        <Link href="/browse-jobs" data-testid="nav-browse-jobs">Browse Jobs</Link>
        {!onPostJobPage && (
          <a href={`${appHost()}/gigs/create`} data-testid="nav-post-job">Post a job</a>
        )}
        {authed ? (
          <Link href="/applications" data-testid="nav-my-applications">My Applications</Link>
        ) : (
          <Link href="/login" data-testid="nav-login">Login</Link>
        )}
      </nav>
    </header>
  );
}

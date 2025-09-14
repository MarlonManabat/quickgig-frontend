import type { ReactNode } from 'react';
import Link from 'next/link';

// NOTE: use canonical test IDs for smoke on desktop and mobile links.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header className="border-b">
        <nav className="mx-auto flex items-center gap-4 p-3">
          <Link href="/" className="font-medium">QuickGig</Link>

          {/* Desktop links (visible ≥md) */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/browse-jobs" data-testid="nav-browse-jobs">Browse jobs</Link>
            <Link href="/post-job" data-testid="nav-post-job">Post a job</Link>
            <Link href="/applications" data-testid="nav-my-applications">My Applications</Link>
            <Link href="/login" data-testid="nav-login">Login</Link>
          </div>

          {/* Mobile menu toggle and menu */}
          <details className="md:hidden ml-auto" data-testid="nav-menu">
            <summary className="cursor-pointer px-3 py-1 border rounded">Menu</summary>
            <div className="mt-2 flex flex-col gap-2">
              <Link href="/browse-jobs" data-testid="nav-browse-jobs">Browse jobs</Link>
              <Link href="/post-job" data-testid="nav-post-job">Post a job</Link>
              <Link href="/applications" data-testid="nav-my-applications">My Applications</Link>
              <Link href="/login" data-testid="nav-login">Login</Link>
            </div>
          </details>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}


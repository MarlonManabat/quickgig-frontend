'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header data-testid="header" className="border-b">
      <nav className="mx-auto max-w-screen-lg flex items-center gap-6 p-3">
        <Link href="/" className="font-semibold">QuickGig</Link>
        <button
          data-testid="nav-mobile-toggle"
          className="ml-auto md:hidden"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <ul className={`md:flex gap-4 ${open ? 'flex' : 'hidden md:flex'}`}>
          <li><Link href="/browse-jobs" data-testid="nav-browse-jobs">Browse jobs</Link></li>
          <li><Link href="/gigs/create" data-testid="nav-post-job">Post a job</Link></li>
          <li><Link href="/applications" data-testid="nav-my-applications">My Applications</Link></li>
          <li><Link href="/login"        data-testid="nav-login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
}

'use client';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';

export default function Header() {
  const { user, signOut } = useUser();
  return (
    <header data-testid="app-header" className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <Link href="/" className="font-semibold">QuickGig</Link>
        <nav className="flex items-center gap-4">
          <Link href="/gigs">Browse jobs</Link>
          <Link href="/gigs/create">Post a job</Link>
          <Link href="/applications">My Applications</Link>
          {user ? (
            <button onClick={() => signOut()} className="underline">Sign out</button>
          ) : (
            <Link href="/login" className="underline">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

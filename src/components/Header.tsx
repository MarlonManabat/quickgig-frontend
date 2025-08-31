'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header data-testid="app-header" className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <Link href="/" className="font-semibold">QuickGig</Link>
        <nav className="flex items-center gap-4">
          <Link href="/gigs" className="hover:underline">Find Work</Link>
          <Link href="/post" className="hover:underline">Post Job</Link>
        </nav>
      </div>
    </header>
  );
}

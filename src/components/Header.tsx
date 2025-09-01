'use client';
import Link from 'next/link';
import MainNav from './nav/MainNav';

export default function Header() {
  return (
    <header data-testid="app-header" className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <Link href="/" className="font-semibold">QuickGig</Link>
        <MainNav />
      </div>
    </header>
  );
}

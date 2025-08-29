'use client';

import Link from 'next/link';

export default function AppHeader() {
  return (
    <header className="w-full border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-end gap-6 p-4 text-sm">
        <Link href="/find">Find work</Link>
        <Link href="/post">Post job</Link>
        <Link href="/login">Login</Link>
      </nav>
    </header>
  );
}

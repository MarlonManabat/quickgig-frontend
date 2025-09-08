'use client';

import { withAppOrigin } from '@/lib/url';
import LandingCTAs from '@/components/landing/LandingCTAs';

export default function AppHeader() {
  return (
    <header className="w-full border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-end gap-6 p-4 text-sm">
        <LandingCTAs startClassName="hover:underline" postClassName="hover:underline" />
        <a href={withAppOrigin('/login')} className="hover:underline">
          Login
        </a>
      </nav>
    </header>
  );
}

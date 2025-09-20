import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Header } from '@/components/layout/header';
import { getSession } from '@/lib/auth';

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuickGig.ph',
  description: 'Maghanap at mag-post ng gigs sa buong Pilipinas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  const nextOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN;
  const postJobHref = (() => {
    if (session) return '/gigs/create';
    if (nextOrigin) {
      const url = new URL('/login', nextOrigin);
      url.searchParams.set('next', '/gigs/create');
      return url.toString();
    }
    return `/login?next=${encodeURIComponent('/gigs/create')}`;
  })();

  return (
    <html lang="en" className={font.className} suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <Header session={session} postJobHref={postJobHref} />
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}

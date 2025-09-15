import type { ReactNode } from 'react';
import './globals.css';
import Header from '@/components/Header';

export const metadata = {
  // Quiets Next metadataBase warning in CI; falls back to local dev URL.
  metadataBase: (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4010');
    } catch {
      return new URL('http://localhost:4010');
    }
  })(),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

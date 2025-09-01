import '@/styles/globals.css';
import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
  ),
  title: 'QuickGig App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}

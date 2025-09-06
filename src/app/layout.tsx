import '@/styles/globals.css';
import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import Analytics from '@/components/Analytics';

export const metadata: Metadata = {
  title: 'QuickGig App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

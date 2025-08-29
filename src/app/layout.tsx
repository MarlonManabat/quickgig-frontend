import '@/styles/globals.css';
import type { Metadata } from 'next';
import AppHeader from '@/components/app/AppHeader';

export const metadata: Metadata = {
  title: 'QuickGig App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}

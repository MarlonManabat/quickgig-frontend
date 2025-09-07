import '@/styles/globals.css';
import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import Analytics from '@/components/Analytics';

export const metadata: Metadata = {
  title: 'QuickGig App',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_ORIGIN || 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PH">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <AppHeader />
        <main id="main-content" className="main-container">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}

import * as React from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import Container from './Container';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isError = router.pathname === '/404' || router.pathname === '/500';
  return (
    <div className="min-h-screen bg-surface text-text flex flex-col">
      {!isError && <Header />}
      <main className="flex-1 py-6 bg-surface">
        <Container>{children}</Container>
      </main>
      {!isError && <Footer />}
    </div>
  );
}

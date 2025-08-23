import * as React from 'react';
import Header from './Header';
import Footer from './Footer';
import Container from './Container';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-text flex flex-col">
      <Header />
      <main className="flex-1 py-6 bg-surface">
        <Container>{children}</Container>
      </main>
      <Footer />
    </div>
  );
}

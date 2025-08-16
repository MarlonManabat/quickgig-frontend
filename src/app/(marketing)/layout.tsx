// Server component
import React from 'react';
import '@/styles/legacy.css';

export const metadata = {
  title: 'QuickGig.ph',
  description: 'Gigs and talent, matched fast.',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  // IMPORTANT: wrapper class isolates the subtree so Tailwind/Next preflight can’t change legacy CSS
  return <div className="legacy-root">{children}</div>;
}

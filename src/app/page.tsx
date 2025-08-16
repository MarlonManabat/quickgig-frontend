import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';
import LegacyShell from '@/components/LegacyShell';
import MarketingHome from './(marketing)/MarketingHome';
import { env } from '@/config/env';

export const metadata: Metadata = {
  title: 'QuickGig',
  description: 'Gigs and talent, matched fast.',
};

export default function Page() {
  if (env.NEXT_PUBLIC_LEGACY_UI) {
    return (
      <LegacyShell>
        <MarketingHome />
      </LegacyShell>
    );
  }
  return <HomePageClient />;
}

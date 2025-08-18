import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';
import { env } from '@/config/env';

export const metadata: Metadata = {
  title: 'QuickGig',
  description: env.NEXT_PUBLIC_ENABLE_I18N_POLISH
    ? 'Fast-track your next gig with QuickGig.'
    : 'Gigs and talent, matched fast.',
};

export default async function Page() {
  return <HomePageClient />;
}


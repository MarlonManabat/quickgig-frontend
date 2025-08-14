import type { Metadata } from 'next';
import HomePageClient from './_components/HomePageClient';

export const metadata: Metadata = {
  title: 'QuickGig',
  description: 'Gigs and talent, matched fast.',
};

export default async function Page() {
  return <HomePageClient />;
}


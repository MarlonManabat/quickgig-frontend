import type { Metadata } from 'next';
import { canonical } from '@/lib/canonical';
import HomePageClient from './HomePageClient';

export function generateMetadata(): Metadata {
  return {
    alternates: { canonical: canonical('/') },
  };
}

export default function Page() {
  return <HomePageClient />;
}


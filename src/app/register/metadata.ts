import type { Metadata } from 'next';
import { canonical } from '@/lib/canonical';

export function generateMetadata(): Metadata {
  return {
    alternates: { canonical: canonical('/register') },
  };
}

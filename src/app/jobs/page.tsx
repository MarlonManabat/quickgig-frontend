import type { Metadata } from 'next';
import { canonical } from '@/lib/canonical';
import JobsClient from './JobsClient';

export function generateMetadata(): Metadata {
  return {
    alternates: { canonical: canonical('/jobs') },
  };
}

export default function JobsPage() {
  return <JobsClient />;
}

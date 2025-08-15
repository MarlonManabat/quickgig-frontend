import Link from 'next/link';
import SeoHead from '@/components/SeoHead';

export default function NotFoundPage() {
  return (
    <>
      <SeoHead title="Page not found" />
      <main className="p-4 space-y-4">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <Link href="/jobs" className="text-qg-accent">
          Go to jobs
        </Link>
      </main>
    </>
  );
}

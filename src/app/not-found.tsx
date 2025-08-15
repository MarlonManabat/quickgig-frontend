import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
      <Link href="/jobs" className="text-qg-accent">
        Browse jobs
      </Link>
    </main>
  );
}

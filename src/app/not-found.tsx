import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="p-4 text-center space-y-4">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/jobs" className="text-sky-600 underline">Back to jobs</Link>
    </main>
  );
}

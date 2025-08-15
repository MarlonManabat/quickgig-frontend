'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="p-4 text-center space-y-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p>Please try again later.</p>
      <Link href="/jobs" className="text-sky-600 underline">Back to jobs</Link>
    </main>
  );
}

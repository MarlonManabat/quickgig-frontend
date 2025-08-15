'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p>Sorry, an unexpected error occurred.</p>
      <div className="space-x-4">
        <button onClick={reset} className="text-qg-accent">
          Try again
        </button>
        <Link href="/jobs" className="text-qg-accent">
          Go to jobs
        </Link>
      </div>
    </main>
  );
}

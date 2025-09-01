'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('applications error:', error);
  }, [error]);

  return (
    <main className="mx-auto max-w-4xl p-6 text-center">
      <h1 className="text-2xl font-semibold mb-2">Unable to load applications</h1>
      <p className="text-slate-600 mb-4">Please try again.</p>
      <button onClick={() => reset()} className="border rounded px-4 py-2" aria-label="Retry">
        Retry
      </button>
    </main>
  );
}

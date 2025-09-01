'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => { console.error('App error:', error); }, [error]);
  return (
    <main className="mx-auto max-w-xl p-10 text-center">
      <h1 className="text-3xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-slate-600 mb-4">Please retry. If the issue persists, try again later.</p>
      <button onClick={() => reset()} className="border rounded px-4 py-2">Try again</button>
    </main>
  );
}

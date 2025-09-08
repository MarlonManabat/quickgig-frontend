"use client";
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="container mx-auto px-4 py-10 space-y-4">
      <h1 className="text-xl font-semibold">We couldn’t load your applications</h1>
      <p className="opacity-70">Please try again. If the problem continues, sign out then sign in again.</p>
      <div className="flex gap-3">
        <button onClick={reset} className="rounded-xl border px-4 py-2">Try again</button>
        <Link href={ROUTES.home} className="underline">Home</Link>
        <Link href={ROUTES.browseJobs} className="underline">Browse jobs</Link>
      </div>
    </main>
  );
}

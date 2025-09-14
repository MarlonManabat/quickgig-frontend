'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-4">QuickGig</h1>
      <p className="mb-6">Find gigs fast. This landing intentionally renders a 200 in CI.</p>
      <button
        data-testid="hero-start"
        className="px-4 py-2 border rounded"
        onClick={() => (window.location.href = '/browse-jobs')}
      >
        Start browsing
      </button>
    </main>
  );
}


"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-2">We couldn’t load your tickets</h1>
      <p className="mb-4">Please try again. If the problem continues, sign out then sign in again.</p>
      <button onClick={reset} className="rounded-xl border px-4 py-2">Try again</button>
    </main>
  );
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-6 text-center">
      <h1 className="text-3xl font-semibold mb-4">Find work. Hire talent.</h1>
      <p className="mb-6 text-slate-600">Quick gigs for everyone.</p>
        <div className="flex justify-center gap-4">
          <Link href="/gigs" className="rounded bg-black text-white px-4 py-2">Browse jobs</Link>
          <Link href="/gigs/create" className="rounded border px-4 py-2">Post a job</Link>
        </div>
      </main>
  );
}

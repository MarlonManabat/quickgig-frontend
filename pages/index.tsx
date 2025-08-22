import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to QuickGig</h1>
      <p className="mb-4">Find freelance gigs or post your own job.</p>
      <div className="space-x-4">
        <Link href="/gigs">Browse Gigs</Link>
        <Link href="/gigs/new">Post a Gig</Link>
      </div>
    </main>
  );
}

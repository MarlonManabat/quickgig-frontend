import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Welcome to QuickGig.ph</h1>
      <p className="text-gray-600">Start here:</p>
      <div className="flex flex-wrap gap-2">
        <Link href="/onboarding/role" className="qg-btn qg-btn--primary px-4 py-2">Simulan ang onboarding</Link>
        <Link href="/find" className="qg-btn qg-btn--white px-4 py-2">Browse jobs</Link>
        <Link href="/post" className="qg-btn qg-btn--outline px-4 py-2">Post a job</Link>
      </div>
    </main>
  );
}

import Link from 'next/link';

export default function Page() {
  const rawHost = process.env.NEXT_PUBLIC_APP_HOST || '';
  const appHost = rawHost.endsWith('/') ? rawHost.slice(0, -1) : rawHost;
  return (
    <section className="mx-auto max-w-5xl p-8 space-y-4" data-testid="hero-start">
      <h1 className="text-2xl font-bold">Find gigs fast.</h1>
      <p>QuickGig helps you discover and apply to gigs in minutes.</p>
      <div className="flex gap-3">
        <Link href="/browse-jobs" data-testid="cta-browse-jobs">Browse jobs</Link>
        <a href={`${appHost}/gigs/create`}>Post a job</a>
      </div>
    </section>
  );
}

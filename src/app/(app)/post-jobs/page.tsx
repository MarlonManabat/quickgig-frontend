import Link from 'next/link';

export default function PostJobsPage() {
  const href = '/' + 'gigs/create';
  return (
    <main className="p-4">
      <Link href={href} data-testid="publish-gig" data-cta="publish-gig" className="underline">
        Publish a gig
      </Link>
    </main>
  );
}

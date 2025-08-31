import Skeleton from '@/components/gigs/Skeleton';

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <ul className="grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </ul>
    </main>
  );
}

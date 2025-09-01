import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      {/* title + meta */}
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/3" />

      {/* body */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* CTA */}
      <Skeleton className="h-10 w-32" />
    </main>
  );
}

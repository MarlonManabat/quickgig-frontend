import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-xl">
            <Skeleton className="h-5 w-3/5 mb-2" />
            <Skeleton className="h-4 w-4/5 mb-1" />
            <Skeleton className="h-4 w-2/5" />
          </div>
        ))}
      </div>
    </main>
  );
}

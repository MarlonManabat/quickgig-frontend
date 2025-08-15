import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <main className="p-4 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </main>
  );
}

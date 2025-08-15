import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <main className="p-4 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
    </main>
  );
}

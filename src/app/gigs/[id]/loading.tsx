import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Skeleton className="h-8 w-2/3 mb-4" />
      <Skeleton className="h-4 w-1/3 mb-2" />
      <Skeleton className="h-4 w-1/4 mb-6" />
      <Skeleton className="h-40 w-full" />
    </main>
  );
}

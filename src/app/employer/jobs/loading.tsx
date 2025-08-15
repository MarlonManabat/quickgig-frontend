import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <main className="p-4 space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="border rounded p-4 space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </main>
  );
}

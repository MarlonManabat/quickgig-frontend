import { Skeleton } from '@/components/ui/skeleton';

export default function CreateGigLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-4" data-testid="post-job-skeleton">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-1/2" />
    </div>
  );
}

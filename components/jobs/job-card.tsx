import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Job } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { findRegionByCode } from '@/lib/regions';

export function JobCard({ job }: { job: Job }) {
  const region = findRegionByCode(job.region);

  return (
    <Link href={`/jobs/${job.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" data-testid="job-card">
      <Card className="flex h-full flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <Badge>{region?.name ?? job.region}</Badge>
          </div>
          <CardDescription>
            {job.city} • Posted {formatDate(job.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between gap-4">
          <p className="text-sm leading-relaxed text-foreground/80">{job.description}</p>
          <span className="inline-flex items-center text-sm font-semibold text-primary">Mag-apply →</span>
        </CardContent>
      </Card>
    </Link>
  );
}

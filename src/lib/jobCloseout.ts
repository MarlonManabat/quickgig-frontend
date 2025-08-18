import type { JobCloseout } from '@/types/jobs';
import { readApps, mockMarkNotSelected } from './applicantStore';
import type { ApplicationSummary } from '@/types/application';

export function jobState(job: { closeout?: JobCloseout }): 'open' | 'closed' | 'filled' {
  if (job.closeout)
    return job.closeout.reason === 'filled' ? 'filled' : 'closed';
  return 'open';
}

export function bulkRejectRemaining(jobId: string): number {
  const apps: ApplicationSummary[] = readApps().filter(
    (a) => a.jobId === jobId && !['hired', 'offer_accepted'].includes(a.status),
  );
  apps.forEach((a) => mockMarkNotSelected(a.id));
  return apps.length;
}

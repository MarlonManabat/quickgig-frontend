export interface Job {
  id: string | number;
  title: string;
  company: string;
  location: string;
  rate?: string;
  description: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'paused';
  closeout?: JobCloseout;
}

export type JobCloseReason = 'filled' | 'paused' | 'expired' | 'other';
export interface JobCloseout {
  at: string;
  by: 'employer';
  reason: JobCloseReason;
  note?: string;
}

export function deriveJobState(job: Job): 'open' | 'closed' | 'filled' {
  if (job.closeout)
    return job.closeout.reason === 'filled' ? 'filled' : 'closed';
  return 'open';
}

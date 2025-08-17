import type { ApplicantSummary, ApplicantStatus } from './applicant';

export type JobSummary = {
  id: string | number;
  title: string;
  company?: string;
  location?: string;
  payRange?: string;
  url?: string;
  tags?: string[];
  postedAt?: string;
  applicants?: ApplicantSummary[];
  counts?: Record<ApplicantStatus | 'total', number>;
  employerId?: string;
};

export type JobDetail = JobSummary & {
  description?: string;
};

export function toJobSummary(job: JobDetail): JobSummary {
  const { id, title, company, location, payRange, url, tags, postedAt, applicants, counts } = job;
  return { id, title, company, location, payRange, url, tags, postedAt, applicants, counts };
}

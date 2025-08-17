export type JobSummary = {
  id: string | number;
  title: string;
  company?: string;
  location?: string;
  payRange?: string;
  url?: string;
  tags?: string[];
  postedAt?: string;
  applicants?: number;
};

export type JobDetail = JobSummary & {
  description?: string;
};

export interface ApplicantSummary {
  id: string;
  name: string;
  email: string;
  submittedAt: string;
}

export function toJobSummary(job: JobDetail): JobSummary {
  const { id, title, company, location, payRange, url, tags, postedAt, applicants } = job;
  return { id, title, company, location, payRange, url, tags, postedAt, applicants };
}

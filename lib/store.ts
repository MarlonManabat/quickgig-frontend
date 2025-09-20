import 'server-only';

import { randomUUID } from 'node:crypto';

import { demoJobs } from '@/data/demo-jobs';

export type Job = {
  id: string;
  title: string;
  description: string;
  region: string;
  city: string;
  createdAt: string;
  published: boolean;
  employerId?: string | null;
};

export type Application = {
  id: string;
  jobId: string;
  workerId: string;
  createdAt: string;
};

type StoreShape = {
  jobs: Map<string, Job>;
  applications: Map<string, Application>;
};

type GlobalWithStore = typeof globalThis & { __quickgigStore?: StoreShape };

function bootstrapStore(): StoreShape {
  const jobs = new Map<string, Job>();
  for (const job of demoJobs) {
    jobs.set(job.id, {
      ...job,
      published: true,
      employerId: null,
    });
  }
  return {
    jobs,
    applications: new Map(),
  };
}

function getStore(): StoreShape {
  const globalRef = globalThis as GlobalWithStore;
  if (!globalRef.__quickgigStore) {
    globalRef.__quickgigStore = bootstrapStore();
  }
  return globalRef.__quickgigStore;
}

export function listJobs(filters?: { region?: string; city?: string }) {
  const { jobs } = getStore();
  const values = Array.from(jobs.values()).filter((job) => job.published);
  return values
    .filter((job) => {
      if (filters?.region && job.region !== filters.region) return false;
      if (filters?.city && job.city !== filters.city) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getJob(jobId: string) {
  const { jobs } = getStore();
  return jobs.get(jobId) ?? null;
}

export function createJob(input: Omit<Job, 'id' | 'createdAt' | 'published'> & { published?: boolean }) {
  const { jobs } = getStore();
  const id = randomUUID();
  const job: Job = {
    id,
    title: input.title,
    description: input.description,
    region: input.region,
    city: input.city,
    employerId: input.employerId ?? null,
    createdAt: new Date().toISOString(),
    published: input.published ?? true,
  };
  jobs.set(id, job);
  return job;
}

export function applyToJob({ jobId, workerId }: { jobId: string; workerId: string }) {
  const { jobs, applications } = getStore();
  if (!jobs.has(jobId)) {
    throw new Error('Job not found');
  }
  const id = randomUUID();
  const application: Application = {
    id,
    jobId,
    workerId,
    createdAt: new Date().toISOString(),
  };
  applications.set(id, application);
  return application;
}

export function listApplications(workerId: string) {
  const { applications, jobs } = getStore();
  return Array.from(applications.values())
    .filter((app) => app.workerId === workerId)
    .map((app) => ({
      ...app,
      job: jobs.get(app.jobId) ?? null,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function clearStore() {
  const globalRef = globalThis as GlobalWithStore;
  globalRef.__quickgigStore = bootstrapStore();
}

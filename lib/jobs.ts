import 'server-only';

import { z } from 'zod';

import { Session } from '@/lib/auth';
import { getServiceRoleClient } from '@/lib/supabase-server';
import {
  applyToJob as applyViaStore,
  createJob as createViaStore,
  getJob as getJobFromStore,
  listApplications as listApplicationsFromStore,
  listJobs as listJobsFromStore,
  type Job,
} from '@/lib/store';

export const jobFormSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  region: z.string().min(2),
  city: z.string().min(2),
  published: z.boolean().default(true),
});

export type JobFormInput = z.infer<typeof jobFormSchema>;

export async function listJobs(filters?: { region?: string; city?: string }): Promise<Job[]> {
  const client = getServiceRoleClient();
  if (!client) {
    return listJobsFromStore(filters);
  }
  const query = client
    .from('jobs')
    .select('id,title,description,region,city,created_at,published,employer_id')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (filters?.region) {
    query.eq('region', filters.region);
  }
  if (filters?.city) {
    query.eq('city', filters.city);
  }
  const { data, error } = await query;
  if (error || !data) {
    console.warn('Falling back to in-memory jobs list', error);
    return listJobsFromStore(filters);
  }
  return data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    region: item.region,
    city: item.city,
    employerId: item.employer_id,
    createdAt: item.created_at,
    published: item.published,
  }));
}

export async function fetchJob(jobId: string): Promise<Job | null> {
  const client = getServiceRoleClient();
  if (!client) {
    return getJobFromStore(jobId);
  }
  const { data, error } = await client
    .from('jobs')
    .select('id,title,description,region,city,created_at,published,employer_id')
    .eq('id', jobId)
    .maybeSingle();
  if (error || !data) {
    return getJobFromStore(jobId);
  }
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    region: data.region,
    city: data.city,
    employerId: data.employer_id,
    createdAt: data.created_at,
    published: data.published,
  };
}

export async function createJob(input: JobFormInput, session: Session): Promise<Job> {
  const parsed = jobFormSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }
  const client = getServiceRoleClient();
  if (!client) {
    return createViaStore({ ...parsed.data, employerId: session.userId });
  }
  const payload = {
    title: parsed.data.title,
    description: parsed.data.description,
    region: parsed.data.region,
    city: parsed.data.city,
    published: parsed.data.published,
    employer_id: session.userId,
  };
  const { data, error } = await client.from('jobs').insert(payload).select().single();
  if (error || !data) {
    console.error('Failed to create job via Supabase, using in-memory store', error);
    return createViaStore({ ...parsed.data, employerId: session.userId });
  }
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    region: data.region,
    city: data.city,
    employerId: data.employer_id,
    createdAt: data.created_at,
    published: data.published,
  };
}

export async function applyToJob(jobId: string, session: Session) {
  const client = getServiceRoleClient();
  if (!client) {
    return applyViaStore({ jobId, workerId: session.userId });
  }
  const payload = {
    job_id: jobId,
    worker_id: session.userId,
  };
  const { data, error } = await client.from('applications').insert(payload).select().single();
  if (error || !data) {
    console.error('Failed to apply via Supabase, using in-memory store', error);
    return applyViaStore({ jobId, workerId: session.userId });
  }
  return data;
}

export async function listMyApplications(session: Session) {
  const client = getServiceRoleClient();
  if (!client) {
    return listApplicationsFromStore(session.userId);
  }
  const { data, error } = await client
    .from('applications')
    .select('id,job_id,created_at,jobs(id,title,city,region,description)')
    .eq('worker_id', session.userId)
    .order('created_at', { ascending: false });
  if (error || !data) {
    console.warn('Falling back to in-memory applications list', error);
    return listApplicationsFromStore(session.userId);
  }
  return data.map((item) => ({
    id: item.id,
    jobId: item.job_id,
    createdAt: item.created_at,
    job: item.jobs
      ? {
          id: item.jobs.id,
          title: item.jobs.title,
          city: item.jobs.city,
          region: item.jobs.region,
          description: item.jobs.description,
        }
      : null,
  }));
}

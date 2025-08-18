import type { CompanyProfile } from '@/types/company';

export interface EmployerJob {
  id: string;
  title: string;
  description: string;
  location?: string;
  payRange?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'paused';
  updatedAt: string;
}

const COMPANY_KEY = 'company';
const JOBS_KEY = 'jobs';
let memoryCompany: CompanyProfile | null = null;
let memoryJobs: EmployerJob[] | null = null;

function readCompany(): CompanyProfile | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(COMPANY_KEY);
    return raw ? (JSON.parse(raw) as CompanyProfile) : null;
  }
  return memoryCompany;
}

function writeCompany(c: CompanyProfile) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(COMPANY_KEY, JSON.stringify(c));
  } else {
    memoryCompany = c;
  }
}

function readJobs(): EmployerJob[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(JOBS_KEY);
    return raw ? (JSON.parse(raw) as EmployerJob[]) : [];
  }
  return memoryJobs || [];
}

function writeJobs(jobs: EmployerJob[]) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  } else {
    memoryJobs = jobs;
  }
}

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export async function getCompany(cookie?: string): Promise<CompanyProfile | null> {
  if (MODE === 'mock') {
    return readCompany();
  }
  const res = await fetch(`${BASE}/api/company`, {
    headers: { Cookie: cookie || '' },
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as CompanyProfile;
}

export async function updateCompany(
  partial: Partial<CompanyProfile>,
  cookie?: string,
): Promise<CompanyProfile> {
  if (MODE === 'mock') {
    const current =
      readCompany() || ({ id: '1', name: '', updatedAt: new Date().toISOString() } as CompanyProfile);
    const updated: CompanyProfile = {
      ...current,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    writeCompany(updated);
    return updated;
  }
  const res = await fetch(`${BASE}/api/company`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify(partial),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as CompanyProfile;
}

export async function listJobs(cookie?: string): Promise<EmployerJob[]> {
  if (MODE === 'mock') {
    return readJobs();
  }
  const res = await fetch(`${BASE}/api/employer/jobs`, {
    headers: { Cookie: cookie || '' },
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as EmployerJob[];
}

export async function getJob(id: string, cookie?: string): Promise<EmployerJob | null> {
  if (MODE === 'mock') {
    const jobs = readJobs();
    return jobs.find((j) => j.id === id) || null;
  }
  const res = await fetch(`${BASE}/api/employer/jobs/${id}`, {
    headers: { Cookie: cookie || '' },
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as EmployerJob;
}

export async function createJobDraft(cookie?: string): Promise<EmployerJob> {
  if (MODE === 'mock') {
    const now = new Date().toISOString();
    const job: EmployerJob = {
      id: String(Date.now()),
      title: 'Untitled Job',
      description: '',
      location: '',
      payRange: '',
      tags: [],
      status: 'draft',
      updatedAt: now,
    };
    const jobs = readJobs();
    jobs.push(job);
    writeJobs(jobs);
    return job;
  }
  const res = await fetch(`${BASE}/api/employer/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as EmployerJob;
}

export async function updateJob(
  id: string,
  patch: Partial<EmployerJob>,
  cookie?: string,
): Promise<EmployerJob> {
  if (MODE === 'mock') {
    const jobs = readJobs();
    const idx = jobs.findIndex((j) => j.id === id);
    if (idx === -1) throw new Error('not found');
    const updated: EmployerJob = {
      ...jobs[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    jobs[idx] = updated;
    writeJobs(jobs);
    return updated;
  }
  const res = await fetch(`${BASE}/api/employer/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as EmployerJob;
}

export async function publishJob(id: string, cookie?: string): Promise<EmployerJob> {
  if (MODE === 'mock') {
    return updateJob(id, { status: 'published' }, cookie);
  }
  const res = await fetch(`${BASE}/api/employer/jobs/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify({ status: 'published' }),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as EmployerJob;
}

export async function pauseJob(id: string, cookie?: string): Promise<EmployerJob> {
  if (MODE === 'mock') {
    return updateJob(id, { status: 'paused' }, cookie);
  }
  const res = await fetch(`${BASE}/api/employer/jobs/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify({ status: 'paused' }),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as EmployerJob;
}

export { readJobs };

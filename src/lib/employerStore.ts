import type { CompanyProfile } from '@/types/company';
import type { JobMetrics, JobReport } from '@/types/metrics';
import type {
  ApplicationDetail,
  ApplicationEvent,
  ApplicationStatus,
} from '@/types/applications';
import { seedMockApps } from './applicantStore';
import type { Interview, InterviewStatus } from '@/types/interviews';
import { readInterviews, writeInterviews } from './interviewStore';
import type { JobCloseout, JobCloseReason } from '@/types/jobs';
import { bulkRejectRemaining } from './jobCloseout';

export interface EmployerJob {
  id: string;
  title: string;
  description: string;
  location?: string;
  payRange?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'paused';
  metrics?: import('@/types/metrics').JobMetrics;
  updatedAt: string;
  closeout?: JobCloseout;
}

const COMPANY_KEY = 'company';
const JOBS_KEY = 'jobs';
const REPORTS_KEY = 'reports';
let memoryCompany: CompanyProfile | null = null;
let memoryJobs: EmployerJob[] | null = null;
let memoryReports: JobReport[] | null = null;
const DETAIL_KEY = 'app-details';
let memoryAppDetails: Record<string, ApplicationDetail> | null = null;

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

function readAppDetails(): Record<string, ApplicationDetail> {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(DETAIL_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ApplicationDetail>) : {};
  }
  return memoryAppDetails || {};
}

function writeAppDetails(details: Record<string, ApplicationDetail>) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(DETAIL_KEY, JSON.stringify(details));
  } else {
    memoryAppDetails = details;
  }
}

function readReports(): JobReport[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(REPORTS_KEY);
    return raw ? (JSON.parse(raw) as JobReport[]) : [];
  }
  return memoryReports || [];
}

function writeReports(reports: JobReport[]) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } else {
    memoryReports = reports;
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

export async function closeJob(
  id: string,
  payload: { reason: JobCloseReason; note?: string; bulkNotify?: boolean },
  cookie?: string,
): Promise<{ job: EmployerJob; rejected: number }> {
  if (MODE === 'mock') {
    const jobs = readJobs();
    const idx = jobs.findIndex((j) => j.id === id);
    if (idx === -1) throw new Error('not found');
    const closeout: JobCloseout = {
      at: new Date().toISOString(),
      by: 'employer',
      reason: payload.reason,
      note: payload.note,
    };
    jobs[idx].closeout = closeout;
    writeJobs(jobs);
    let rejected = 0;
    if (payload.bulkNotify) rejected = bulkRejectRemaining(id);
    return { job: jobs[idx], rejected };
  }
  const res = await fetch(`${BASE}/api/employer/jobs/${id}/close`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as { job: EmployerJob; rejected: number };
}

export async function reopenJob(
  id: string,
  cookie?: string,
): Promise<EmployerJob> {
  if (MODE === 'mock') {
    const jobs = readJobs();
    const idx = jobs.findIndex((j) => j.id === id);
    if (idx === -1) throw new Error('not found');
    delete jobs[idx].closeout;
    writeJobs(jobs);
    return jobs[idx];
  }
  const res = await fetch(`${BASE}/api/employer/jobs/${id}/reopen`, {
    method: 'POST',
    headers: { Cookie: cookie || '' },
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as EmployerJob;
}

export async function bulkRejectJob(id: string, cookie?: string): Promise<{ count: number }> {
  if (MODE === 'mock') {
    const count = bulkRejectRemaining(id);
    return { count };
  }
  const res = await fetch(`${BASE}/api/employer/jobs/${id}/bulk/reject`, {
    method: 'POST',
    headers: { Cookie: cookie || '' },
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as { count: number };
}

export async function incrementJobViews(jobId: string, cookie?: string): Promise<JobMetrics> {
  if (MODE === 'mock') {
    const jobs = readJobs();
    const idx = jobs.findIndex((j) => j.id === jobId);
    if (idx === -1) throw new Error('not found');
    const current = jobs[idx].metrics || { views: 0, applies: 0, messages: 0, updatedAt: new Date().toISOString() };
    const metrics: JobMetrics = {
      ...current,
      views: current.views + 1,
      updatedAt: new Date().toISOString(),
    };
    jobs[idx].metrics = metrics;
    writeJobs(jobs);
    return metrics;
  }
  const res = await fetch(`${BASE}/api/jobs/${jobId}/metrics/views`, {
    method: 'POST',
    headers: { Cookie: cookie || '' },
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  const json = (await res.json()) as { metrics: JobMetrics };
  return json.metrics;
}

export async function countApplicantsForEmployer(cookie?: string): Promise<number> {
  if (MODE === 'mock') {
    const jobs = readJobs();
    return jobs.reduce((sum, j) => sum + (j.metrics?.applies || 0), 0);
    }
  const res = await fetch(`${BASE}/api/employer/applicants/count`, {
    headers: { Cookie: cookie || '' },
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  const json = (await res.json()) as { count: number };
  return json.count;
}

export async function listReports(cookie?: string): Promise<JobReport[]> {
  if (MODE === 'mock') {
    return readReports();
  }
  const res = await fetch(`${BASE}/api/admin/reports`, {
    headers: { Cookie: cookie || '' },
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  const json = (await res.json()) as { reports: JobReport[] };
  return json.reports || [];
}

export async function createReport(
  r: Omit<JobReport, 'id' | 'createdAt' | 'resolved'>,
  cookie?: string,
): Promise<JobReport> {
  if (MODE === 'mock') {
    const report: JobReport = {
      ...r,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      resolved: false,
    };
    const reports = readReports();
    reports.push(report);
    writeReports(reports);
    return report;
  }
  const res = await fetch(`${BASE}/api/jobs/${r.jobId}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify({ reason: r.reason, notes: r.notes }),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  const json = (await res.json()) as { report: JobReport };
  return json.report;
}

export async function resolveReport(
  id: string,
  patch?: Partial<JobReport>,
  cookie?: string,
): Promise<JobReport> {
  if (MODE === 'mock') {
    const reports = readReports();
    const idx = reports.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('not found');
    const updated: JobReport = {
      ...reports[idx],
      ...patch,
      resolved: patch?.resolved ?? true,
    };
    reports[idx] = updated;
    writeReports(reports);
    return updated;
  }
  const res = await fetch(`${BASE}/api/admin/reports`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify({ id, ...patch }),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  const json = (await res.json()) as { report: JobReport };
  return json.report;
}

export async function getApplicationDetail(
  jobId: string,
  appId: string,
  cookie?: string,
): Promise<ApplicationDetail | null> {
  if (MODE === 'mock') {
    seedMockApps();
    const details = readAppDetails();
    const app = details[appId];
    return app && app.jobId === jobId ? app : null;
  }
  const res = await fetch(`${BASE}/api/employer/jobs/${jobId}/applications/${appId}`, {
    headers: { Cookie: cookie || '' },
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as ApplicationDetail;
}

export async function updateApplicationStatus(
  jobId: string,
  appId: string,
  status: ApplicationStatus,
  note?: string,
  cookie?: string,
): Promise<ApplicationDetail> {
  if (MODE === 'mock') {
    const details = readAppDetails();
    const app = details[appId];
    if (!app) throw new Error('not found');
    const event: ApplicationEvent = {
      at: new Date().toISOString(),
      type: status,
      by: 'employer',
      note,
    };
    app.status = status;
    app.events = [event, ...app.events];
    details[appId] = app;
    writeAppDetails(details);
    return app;
  }
  const res = await fetch(`${BASE}/api/employer/jobs/${jobId}/applications/${appId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify({ status, note }),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as ApplicationDetail;
}

export async function appendEmployerNote(
  jobId: string,
  appId: string,
  note: string,
  cookie?: string,
): Promise<ApplicationDetail> {
  const event: ApplicationEvent = {
    at: new Date().toISOString(),
    type: 'note',
    by: 'employer',
    note,
  };
  if (MODE === 'mock') {
    const details = readAppDetails();
    const app = details[appId];
    if (!app) throw new Error('not found');
    app.events = [event, ...app.events];
    details[appId] = app;
    writeAppDetails(details);
    return app;
  }
  const res = await fetch(`${BASE}/api/employer/jobs/${jobId}/applications/${appId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as ApplicationDetail;
}

export async function createInterviewInvite(
  jobId: string,
  appId: string,
  payload: Omit<Interview, 'id' | 'status' | 'jobId' | 'appId' | 'createdAt' | 'updatedAt'>,
  cookie?: string,
): Promise<Interview> {
  if (MODE === 'mock') {
    const map = readInterviews();
    const now = new Date().toISOString();
    const interview: Interview = {
      id: String(Date.now()),
      jobId,
      appId,
      status: 'proposed',
      createdAt: now,
      updatedAt: now,
      ...payload,
    };
    const arr = map[appId] || [];
    arr.push(interview);
    map[appId] = arr;
    writeInterviews(map);
    const details = readAppDetails();
    const app = details[appId];
    if (app) {
      app.events = [
        { at: now, type: 'note', by: 'employer', note: 'Proposed interview' },
        ...app.events,
      ];
      details[appId] = app;
      writeAppDetails(details);
    }
    return interview;
  }
  const res = await fetch(
    `${BASE}/api/employer/jobs/${jobId}/applicants/${appId}/interviews`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as Interview;
}

export async function updateInterviewStatus(
  jobId: string,
  appId: string,
  id: string,
  status: InterviewStatus,
  cookie?: string,
): Promise<Interview> {
  if (MODE === 'mock') {
    const map = readInterviews();
    const arr = map[appId] || [];
    const idx = arr.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('not found');
    const interview = arr[idx];
    interview.status = status;
    interview.updatedAt = new Date().toISOString();
    arr[idx] = interview;
    map[appId] = arr;
    writeInterviews(map);
    return interview;
  }
  const res = await fetch(
    `${BASE}/api/employer/jobs/${jobId}/applicants/${appId}/interviews`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
      body: JSON.stringify({ id, status }),
    },
  );
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as Interview;
}

export { readJobs };

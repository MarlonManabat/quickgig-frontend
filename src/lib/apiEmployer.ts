import type { JobSummary } from '../types/job';
import type { ApplicantSummary } from '../types/applicant';

const BASE = process.env.ENGINE_BASE_URL || '';
const MODE = process.env.ENGINE_MODE;

async function getJSON<T>(path: string): Promise<T> {
  const url = BASE.replace(/\/$/, '') + path;
  const r = await fetch(url, { headers: { accept: 'application/json' } });
  if (!r.ok) throw new Error(String(r.status));
  return r.json() as Promise<T>;
}

export async function listMyJobs(): Promise<JobSummary[]> {
  if (MODE === 'mock') {
    return [
      {
        id: '1',
        title: 'Sample Job',
        location: 'Remote',
        postedAt: new Date().toISOString(),
        applicants: [],
        counts: { total: 3, new: 3, shortlist: 0, interview: 0, hired: 0, rejected: 0 },
      },
      {
        id: '2',
        title: 'Another Gig',
        location: 'Manila',
        postedAt: new Date().toISOString(),
        applicants: [],
        counts: { total: 0, new: 0, shortlist: 0, interview: 0, hired: 0, rejected: 0 },
      },
    ];
  }
  try {
    return await getJSON<JobSummary[]>('/api/employer/jobs');
  } catch {
    return [];
  }
}

export async function listApplicants(jobId: string): Promise<ApplicantSummary[]> {
  if (MODE === 'mock') {
    return [
      {
        id: 'a1',
        name: 'Juan Dela Cruz',
        email: 'juan@example.com',
        submittedAt: new Date().toISOString(),
        status: 'new',
      },
      {
        id: 'a2',
        name: 'Maria Clara',
        email: 'maria@example.com',
        submittedAt: new Date().toISOString(),
        status: 'new',
      },
    ];
  }
  try {
    return await getJSON<ApplicantSummary[]>(`/api/employer/jobs/${jobId}/applicants`);
  } catch {
    return [];
  }
}

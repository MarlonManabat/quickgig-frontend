import type { JobSummary } from '../types/job';
import type { ApplicantSummary, ApplicantStatus } from '../types/applicant';

const KEY = 'qg_employer_jobs';

let memory: JobSummary[] = [];

export function load(): JobSummary[] {
  if (typeof localStorage !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  }
  return memory;
}

export function save(data: JobSummary[]) {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {}
  } else {
    memory = data;
  }
}

export function listJobs(): JobSummary[] {
  return load();
}

export function getApplicants(jobId: string | number): ApplicantSummary[] {
  const job = load().find(j => String(j.id) === String(jobId));
  return job?.applicants || [];
}

export function setStatus(jobId: string | number, applicantId: string, status: ApplicantStatus): ApplicantSummary | undefined {
  const data = load();
  const job = data.find(j => String(j.id) === String(jobId));
  if (!job || !job.applicants) return undefined;
  const applicant = job.applicants.find(a => a.id === applicantId);
  if (!applicant) return undefined;
  applicant.status = status;
  recomputeCounts(job);
  save(data);
  return applicant;
}

export function updateNotes(jobId: string | number, applicantId: string, notes: string): ApplicantSummary | undefined {
  const data = load();
  const job = data.find(j => String(j.id) === String(jobId));
  if (!job || !job.applicants) return undefined;
  const applicant = job.applicants.find(a => a.id === applicantId);
  if (!applicant) return undefined;
  applicant.notes = notes;
  save(data);
  return applicant;
}

export function bulkSetStatus(jobId: string | number, ids: string[], status: ApplicantStatus): ApplicantSummary[] {
  const data = load();
  const job = data.find(j => String(j.id) === String(jobId));
  if (!job || !job.applicants) return [];
  const updated: ApplicantSummary[] = [];
  job.applicants.forEach(a => {
    if (ids.includes(a.id)) {
      a.status = status;
      updated.push(a);
    }
  });
  recomputeCounts(job);
  save(data);
  return updated;
}

function recomputeCounts(job: JobSummary) {
  const counts: Record<ApplicantStatus | 'total', number> = {
    total: 0,
    new: 0,
    shortlist: 0,
    interview: 0,
    hired: 0,
    rejected: 0,
  };
  (job.applicants || []).forEach(a => {
    counts[a.status] = (counts[a.status] || 0) + 1;
    counts.total += 1;
  });
  job.counts = counts;
}

export function ensureSeed() {
  if (process.env.NEXT_PUBLIC_SEED_MOCK !== 'true') return;
  const data = load();
  if (data.length) return;
  const now = new Date().toISOString();
  const jobs: JobSummary[] = [
    {
      id: '1',
      title: 'Sample Job',
      postedAt: now,
      applicants: [
        { id: 'a1', name: 'Juan Dela Cruz', email: 'juan@example.com', submittedAt: now, status: 'new' },
        { id: 'a2', name: 'Maria Clara', email: 'maria@example.com', submittedAt: now, status: 'new' },
        { id: 'a3', name: 'Pedro Penduko', email: 'pedro@example.com', submittedAt: now, status: 'new' },
      ],
    },
    {
      id: '2',
      title: 'Another Gig',
      postedAt: now,
      applicants: [
        { id: 'b1', name: 'Ana Santos', email: 'ana@example.com', submittedAt: now, status: 'new' },
        { id: 'b2', name: 'Berto Reyes', email: 'berto@example.com', submittedAt: now, status: 'new' },
        { id: 'b3', name: 'Carla Dizon', email: 'carla@example.com', submittedAt: now, status: 'new' },
      ],
    },
  ];
  jobs.forEach(recomputeCounts);
  save(jobs);
}

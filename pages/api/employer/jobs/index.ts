import type { NextApiRequest, NextApiResponse } from 'next';
import { listJobs, ensureSeed } from '../../../../src/lib/employerStore';
import type { ApplicantStatus } from '../../../../src/types/applicant';

const MODE = process.env.ENGINE_AUTH_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  if (MODE === 'mock') {
    ensureSeed();
    const jobs = listJobs().map(j => {
      const counts: Record<ApplicantStatus | 'total', number> = {
        total: 0,
        new: 0,
        shortlist: 0,
        interview: 0,
        hired: 0,
        rejected: 0,
      };
      (j.applicants || []).forEach(a => {
        counts[a.status] = (counts[a.status] || 0) + 1;
        counts.total += 1;
      });
      return { ...j, counts };
    });
    return res.status(200).json(jobs);
  }
  try {
    const r = await fetch(`${BASE}/api/employer/jobs`, {
      headers: { cookie: req.headers.cookie || '' },
    });
    const data = await r.json().catch(() => ({}));
    res.status(r.status).json(data);
  } catch {
    res.status(500).json({ error: 'engine_error' });
  }
}

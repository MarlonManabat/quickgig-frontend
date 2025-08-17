import type { NextApiRequest, NextApiResponse } from 'next';
import { getApplicants, ensureSeed } from '../../../../../src/lib/employerStore';
import type { ApplicantSummary } from '../../../../../src/types/applicant';

const MODE = process.env.ENGINE_AUTH_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

function toCsv(applicants: ApplicantSummary[]) {
  const header = 'id,name,email,status,submittedAt,notes';
  const rows = applicants.map((a) => [a.id, a.name, a.email, a.status, a.submittedAt, a.notes || ''].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
  return [header, ...rows].join('\n');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id = '' } = req.query as { id?: string };
  if (req.method !== 'GET') return res.status(405).end();
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="quickgig-applicants-${id}.csv"`);
  if (MODE === 'mock') {
    ensureSeed();
    const apps = getApplicants(id);
    return res.status(200).send(toCsv(apps));
  }
  try {
    const r = await fetch(`${BASE}/api/employer/jobs/${id}/applicants?format=csv`, {
      headers: { cookie: req.headers.cookie || '' },
    });
    const txt = await r.text();
    res.status(r.status).send(txt);
  } catch {
    res.status(500).end();
  }
}


import type { NextApiRequest, NextApiResponse } from 'next';
import { readJobs, readReports } from '@/lib/employerStore';
import { readApps } from '@/lib/applicantStore';
import { renderEmail, sendEmail } from '@/lib/notify';
import type { JobReport } from '@/types/metrics';

const MODE = process.env.ENGINE_MODE || 'mock';
let last = 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }
  const since = Date.now() - 24 * 60 * 60 * 1000;
  let jobs = 0;
  let applications = 0;
  let reports = 0;
  if (MODE === 'mock') {
    try {
      jobs = readJobs().filter((j) => new Date(j.updatedAt).getTime() > since).length;
    } catch {}
    try {
      applications = readApps().filter((a) => new Date(a.updatedAt).getTime() > since).length;
    } catch {}
    try {
      reports = readReports().filter((r: JobReport) => new Date(r.createdAt).getTime() > since).length;
    } catch {}
  }
  if (process.env.NOTIFY_ADMIN_EMAIL && Date.now() - last > 20 * 60 * 1000) {
    last = Date.now();
    const e = renderEmail('digest:admin', { jobs, applications, reports }, 'en');
    void sendEmail(process.env.NOTIFY_ADMIN_EMAIL, e.subject, e.html, e.text);
  }
  res.status(200).json({ ok: true, jobs, applications, reports });
}

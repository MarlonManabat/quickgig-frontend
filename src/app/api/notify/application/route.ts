import { NextResponse } from 'next/server';
import { sendEmail, renderEmail } from '@/lib/notify';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(req: Request) {
  const {
    applicantEmail,
    applicantName,
    employerEmail,
    jobTitle,
    applicationId,
    jobId,
    lang,
  } = await req.json();

  const langCode: 'en' | 'tl' = lang === 'tl' ? 'tl' : 'en';
  const applyUrl = applicationId ? `${BASE}/applications/${applicationId}` : BASE;
  const manageUrl =
    jobId && applicationId
      ? `${BASE}/employer/jobs/${jobId}/applicants/${applicationId}`
      : `${BASE}/employer`;

  const tasks: Promise<unknown>[] = [];
  if (applicantEmail) {
    const e = renderEmail(
      'apply:applicant',
      { title: jobTitle, company: '', applicantName, applyUrl },
      langCode,
    );
    tasks.push(sendEmail(applicantEmail, e.subject, e.html, e.text));
  }
  const toEmployer = employerEmail || process.env.NOTIFY_ADMIN_EMAIL;
  if (toEmployer) {
    const e = renderEmail(
      'apply:employer',
      { title: jobTitle, applicantName, manageUrl },
      'en',
    );
    tasks.push(sendEmail(toEmployer, e.subject, e.html, e.text));
  }
  void Promise.allSettled(tasks);
  return NextResponse.json({ ok: true });
}

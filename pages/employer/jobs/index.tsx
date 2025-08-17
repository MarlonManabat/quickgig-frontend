import * as React from 'react';
import Link from 'next/link';
import ProductShell from '../../../src/components/layout/ProductShell';
import { HeadSEO } from '../../../src/components/HeadSEO';
import { t } from '../../../src/lib/t';
import type { JobSummary } from '../../../src/types/job';
import type { ApplicantStatus } from '../../../src/types/applicant';
import { requireAuthSSR } from '@/lib/auth';
import type { Session } from '../../../src/types/user';

interface Props { jobs: JobSummary[]; session: Session; }

export const getServerSideProps = requireAuthSSR(['employer', 'admin'], async ({ req }) => {
  const base = process.env.BASE_URL || `http://${req.headers.host}`;
  try {
    const r = await fetch(`${base}/api/employer/jobs`, { headers: { cookie: req.headers.cookie || '' } });
    const jobs = await r.json();
    return { jobs };
  } catch {
    return { jobs: [] };
  }
});

const statuses: ApplicantStatus[] = ['new', 'shortlist', 'interview', 'hired', 'rejected'];

export default function EmployerJobsPage({ jobs }: Props) {
  const copyEmails = async (jobId: string | number) => {
    try {
      const r = await fetch(`/api/employer/jobs/${jobId}/emails.txt`);
      const txt = await r.text();
      await navigator.clipboard.writeText(txt);
      alert(t('copied_to_clipboard'));
    } catch {}
  };
  return (
    <ProductShell>
      <HeadSEO titleKey="jobs_title" descKey="jobs_title" />
      <h1>{t('jobs_title')}</h1>
      {jobs.length ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Title</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Posted</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Applicants</th>
              <th style={{ textAlign: 'left', padding: 8 }} />
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="job-row">
                <td style={{ padding: 8 }}>{job.title}</td>
                <td style={{ padding: 8 }}>{job.postedAt ? new Date(job.postedAt).toLocaleDateString() : '-'}</td>
                <td style={{ padding: 8 }}>
                  {statuses.map((s) => {
                    const c = job.counts?.[s] || 0;
                    if (!c) return null;
                    return (
                      <span key={s} style={{ marginRight: 4, background: '#eee', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {t(`status_${s}` as any)} {c}
                      </span>
                    );
                  })}
                </td>
                <td style={{ padding: 8 }}>
                  <Link href={`/employer/jobs/${job.id}/applicants`}>{t('view_applicants')}</Link>
                  <span className="job-row-actions" style={{ marginLeft: 8 }}>
                    <a href={`/api/employer/jobs/${job.id}/applicants.csv`} style={{ marginRight: 4 }}>{t('export_csv')}</a>
                    <button onClick={() => copyEmails(job.id)}>{t('copy_emails')}</button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No jobs yet.</p>
      )}
      <style jsx>{`
        .job-row-actions { visibility: hidden; }
        tr.job-row:hover .job-row-actions { visibility: visible; }
      `}</style>
    </ProductShell>
  );
}

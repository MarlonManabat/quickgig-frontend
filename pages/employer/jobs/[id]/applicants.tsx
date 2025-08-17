import * as React from 'react';
import ProductShell from '../../../../src/components/layout/ProductShell';
import { HeadSEO } from '../../../../src/components/HeadSEO';
import { t } from '../../../../src/lib/t';
import type { ApplicantSummary, ApplicantStatus } from '../../../../src/types/applicant';
import { requireAuthSSR } from '@/lib/auth';
import type { Session } from '../../../../src/types/user';

interface Props { applicants: ApplicantSummary[]; id: string; session: Session; }

export const getServerSideProps = requireAuthSSR(['employer', 'admin'], async ({ req, params }) => {
  const id = String(params?.id || '');
  const base = process.env.BASE_URL || `http://${req.headers.host}`;
  try {
    const r = await fetch(`${base}/api/employer/jobs/${id}/applicants`, { headers: { cookie: req.headers.cookie || '' } });
    const applicants = await r.json();
    return { applicants, id };
  } catch {
    return { applicants: [], id };
  }
});

const statuses: ApplicantStatus[] = ['new', 'shortlist', 'interview', 'hired', 'rejected'];

export default function ApplicantsPage({ applicants, id }: Props) {
  const [items, setItems] = React.useState(applicants);
  const [status, setStatus] = React.useState<'all' | ApplicantStatus>('all');
  const [query, setQuery] = React.useState('');

  const filtered = items.filter(
    (a) =>
      (status === 'all' || a.status === status) &&
      (a.name.toLowerCase().includes(query.toLowerCase()) || a.email.toLowerCase().includes(query.toLowerCase()))
  );

  const updateStatus = async (aid: string, st: ApplicantStatus) => {
    setItems((prev) => prev.map((a) => (a.id === aid ? { ...a, status: st } : a)));
    try {
      await fetch(`/api/employer/jobs/${id}/applicants/${aid}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: st }),
      });
    } catch {}
  };

  return (
    <ProductShell>
      <HeadSEO titleKey="applicants_title" descKey="applicants_title" />
      <h1>{t('applicants_title')}</h1>
      <div style={{ display: 'flex', gap: 8, margin: '8px 0 16px' }}>
        <select value={status} onChange={(e) => setStatus(e.target.value as 'all' | ApplicantStatus)}>
          <option value="all">All</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t(`status_${s}` as any)}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {filtered.length ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Submitted</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td style={{ padding: 8 }}>
                  <a href={`mailto:${a.email}`}>{a.name}</a>
                </td>
                <td style={{ padding: 8 }}>{new Date(a.submittedAt).toLocaleDateString()}</td>
                <td style={{ padding: 8 }}>
                  <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value as ApplicantStatus)}>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {t(`status_${s}` as any)}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: 8 }}>
                  {a.resumeUrl && (
                    <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>
                      View resume
                    </a>
                  )}
                  <button onClick={() => navigator.clipboard.writeText(a.email)}>Copy email</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t('applicants_empty')}</p>
      )}
    </ProductShell>
  );
}

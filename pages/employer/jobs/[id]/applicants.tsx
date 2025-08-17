import * as React from 'react';
import ProductShell from '../../../../src/components/layout/ProductShell';
import { HeadSEO } from '../../../../src/components/HeadSEO';
import { t } from '../../../../src/lib/t';
import type { ApplicantSummary, ApplicantStatus } from '../../../../src/types/applicant';
import { requireAuthSSR } from '@/lib/auth';
import type { Session } from '../../../../src/types/user';
import Link from 'next/link';
import { env } from '@/config/env';

interface Props { applicants: ApplicantSummary[]; id: string; session: Session }

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
  const [items, setItems] = React.useState<ApplicantSummary[]>(applicants);
  const [status, setStatus] = React.useState<'all' | ApplicantStatus>('all');
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [noteId, setNoteId] = React.useState<string | null>(null);
  const [noteVal, setNoteVal] = React.useState('');

  const counts = React.useMemo(() => {
    const c: Record<ApplicantStatus | 'total', number> = { total: items.length, new: 0, shortlist: 0, interview: 0, hired: 0, rejected: 0 };
    items.forEach(a => { c[a.status] = (c[a.status] || 0) + 1; });
    return c;
  }, [items]);

  const filtered = items.filter(a => (status === 'all' || a.status === status) && (a.name.toLowerCase().includes(query.toLowerCase()) || a.email.toLowerCase().includes(query.toLowerCase())));

  const toggleSelect = (id: string, checked: boolean) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (checked) n.add(id); else n.delete(id);
      return n;
    });
  };

  const updateStatus = async (aid: string, st: ApplicantStatus) => {
    setItems(prev => prev.map(a => (a.id === aid ? { ...a, status: st } : a)));
    try {
      await fetch(`/api/employer/jobs/${id}/applicants/${aid}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: st }),
      });
    } catch {}
  };

  const bulkStatus = async (st: ApplicantStatus) => {
    const ids = Array.from(selected);
    setItems(prev => prev.map(a => (ids.includes(a.id) ? { ...a, status: st } : a)));
    setSelected(new Set());
    try {
      await fetch(`/api/employer/jobs/${id}/applicants/bulk`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ids, status: st }),
      });
    } catch {}
  };

  const copyEmails = async () => {
    try {
      const r = await fetch(`/api/employer/jobs/${id}/emails.txt`);
      const txt = await r.text();
      await navigator.clipboard.writeText(txt);
      alert(t('copied_to_clipboard'));
    } catch {}
  };

  const openNotes = (a: ApplicantSummary) => {
    setNoteId(a.id);
    setNoteVal(a.notes || '');
  };
  const saveNotes = async () => {
    if (!noteId) return;
    setItems(prev => prev.map(a => (a.id === noteId ? { ...a, notes: noteVal } : a)));
    try {
      await fetch(`/api/employer/jobs/${id}/applicants/${noteId}/notes`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ notes: noteVal }),
      });
    } catch {}
    setNoteId(null);
  };

  return (
    <ProductShell>
      <HeadSEO titleKey="applicants_title" descKey="applicants_title" />
      <h1>{t('applicants_title')}</h1>
      <div style={{ display: 'flex', gap: 8, margin: '8px 0 16px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setStatus('all')} style={{ fontWeight: status === 'all' ? 'bold' : 'normal' }}>
            All ({counts.total})
          </button>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatus(s)} style={{ fontWeight: status === s ? 'bold' : 'normal' }}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t(`status_${s}` as any)} ({counts[s] || 0})
            </button>
          ))}
        </div>
        <input type="text" placeholder="Search" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      {selected.size > 0 && (
        <div style={{ position: 'sticky', top: 0, background: '#fff', padding: 8, borderBottom: '1px solid #ccc', display: 'flex', gap: 8, zIndex: 1 }}>
          <span>{t('bulk_selected', { n: selected.size })}</span>
          {(['shortlist', 'interview', 'hired', 'rejected'] as ApplicantStatus[]).map(st => (
            <button key={st} onClick={() => bulkStatus(st)}>
              {t(st === 'hired' ? 'hire' : st === 'rejected' ? 'reject' : st)}
            </button>
          ))}
          <a href={`/api/employer/jobs/${id}/applicants.csv`} style={{ marginLeft: 'auto' }}>{t('export_csv')}</a>
          <button onClick={copyEmails}>{t('copy_emails')}</button>
        </div>
      )}
      {filtered.length ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}><input type="checkbox" onChange={e => filtered.forEach(a => toggleSelect(a.id, e.target.checked))} /></th>
              <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Submitted</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td style={{ padding: 8 }}>
                  <input type="checkbox" checked={selected.has(a.id)} onChange={e => toggleSelect(a.id, e.target.checked)} />
                </td>
                <td style={{ padding: 8 }}>
                  <a href={`mailto:${a.email}`}>{a.name}</a>
                </td>
                <td style={{ padding: 8 }}>{new Date(a.submittedAt).toLocaleDateString()}</td>
                <td style={{ padding: 8 }}>
                  <select value={a.status} onChange={e => updateStatus(a.id, e.target.value as ApplicantStatus)}>
                    {statuses.map(s => (
                      <option key={s} value={s}>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {t(`status_${s}` as any)}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: 8 }}>
                  {env.NEXT_PUBLIC_ENABLE_MESSAGES && (
                    <Link
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      href={`/messages/new?to=${a.id}&jobId=${id}&title=${encodeURIComponent((a as any).jobTitle || '')}`}
                      style={{ marginRight: 8 }}
                    >
                      {t('messages.to_applicant')}
                    </Link>
                  )}
                  {a.resumeUrl && (
                    <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>
                      View resume
                    </a>
                  )}
                  <button onClick={() => openNotes(a)} style={{ marginRight: 8 }}>{t('notes')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : items.length ? (
        <p>{t('no_applicants_for_filter')}</p>
      ) : (
        <p>{t('applicants_empty')}</p>
      )}
      {noteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ background: '#fff', margin: '10% auto', padding: 16, maxWidth: 400 }}>
            <h3>{t('notes')}</h3>
            <textarea value={noteVal} onChange={e => setNoteVal(e.target.value)} placeholder={t('notes_placeholder')} style={{ width: '100%', minHeight: 120 }} />
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button onClick={saveNotes}>Save</button>
              <button onClick={() => setNoteId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </ProductShell>
  );
}


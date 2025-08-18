'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import HeadSEO from '@/components/HeadSEO';
import { env } from '@/config/env';
import { toast } from '@/lib/toast';
import { t } from '@/lib/i18n';
import type { ApplicationDetail, ApplicationStatus } from '@/types/applications';
import {
  updateApplicationStatus,
  appendEmployerNote,
  getApplicationDetail,
} from '@/lib/employerStore';

export default function EmployerApplicantPage({ params }: { params: { id: string; appId: string } }) {
  const { id: jobId, appId } = params;
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!env.NEXT_PUBLIC_ENABLE_EMPLOYER_APPLICANT_DRILLDOWN) return;
    getApplicationDetail(jobId, appId).then(setApp).catch(() => setApp(null));
  }, [jobId, appId]);

  const changeStatus = async (s: ApplicationStatus) => {
    if (!app) return;
    const prev = app;
    setApp({ ...app, status: s, events: [{ at: new Date().toISOString(), type: s, by: 'employer' }, ...app.events] });
    try {
      const updated = await updateApplicationStatus(jobId, appId, s);
      setApp(updated);
      toast(t('saved'));
    } catch {
      setApp(prev);
      toast(t('withdraw_error'));
    }
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    try {
      const updated = await appendEmployerNote(jobId, appId, note.trim());
      setApp(updated);
      setNote('');
      toast(t('saved'));
    } catch {
      toast(t('withdraw_error'));
    }
  };

  if (!env.NEXT_PUBLIC_ENABLE_EMPLOYER_APPLICANT_DRILLDOWN) return null;
  if (!app) {
    return (
      <main className="qg-container py-8">
        <p>Loading...</p>
      </main>
    );
  }

  const statusColor = (status: ApplicationStatus) => {
    const map: Record<ApplicationStatus, string> = {
      new: 'bg-gray-200 text-gray-800',
      reviewing: 'bg-blue-200 text-blue-800',
      shortlisted: 'bg-green-200 text-green-800',
      rejected: 'bg-red-200 text-red-800',
      hired: 'bg-green-300 text-green-900',
      withdrawn: 'bg-gray-300 text-gray-700',
    };
    return map[status];
  };
  const statusLabels: Record<ApplicationStatus, string> = {
    new: t('status_new'),
    reviewing: t('status_reviewing'),
    shortlisted: t('status_shortlisted'),
    rejected: t('status_rejected'),
    hired: t('status_hired'),
    withdrawn: t('status_withdrawn'),
  };

  return (
    <>
      <HeadSEO title="Applicant | QuickGig" />
      <main className="qg-container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{appId}</h1>
          <span className={`px-2 py-1 rounded text-sm ${statusColor(app.status)}`}>{statusLabels[app.status]}</span>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={app.status}
            onChange={(e) => changeStatus(e.target.value as ApplicationStatus)}
            className="border p-1 rounded"
          >
            <option value="reviewing">{t('status_reviewing')}</option>
            <option value="shortlisted">{t('status_shortlisted')}</option>
            <option value="rejected">{t('status_rejected')}</option>
            <option value="hired">{t('status_hired')}</option>
          </select>
          <div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border p-1 rounded w-48 text-sm"
              placeholder={t('add_note')}
            />
            <button onClick={saveNote} className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
              {t('add_note')}
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-2">Timeline</h3>
            <ul className="space-y-2">
              {app.events.map((e, i) => (
                <li key={i}>
                  {e.by ? `${e.by}: ` : ''}{e.type}{e.note ? ` - ${e.note}` : ''}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            {app.resumeUrl && (
              <a href={app.resumeUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Resume
              </a>
            )}
            <Link href={`/messages?jobId=${app.jobId}`} className="block text-blue-600 hover:underline">
              {t('view_messages')}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

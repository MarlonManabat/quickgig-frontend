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
import type { Interview } from '@/types/interviews';

export default function EmployerApplicantPage({ params }: { params: { id: string; appId: string } }) {
  const { id: jobId, appId } = params;
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [note, setNote] = useState('');
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [method, setMethod] = useState<'in-person' | 'phone' | 'video'>('phone');
  const [location, setLocation] = useState('');
  const [slotInputs, setSlotInputs] = useState<string[]>(['']);
  const [inviteNote, setInviteNote] = useState('');

  useEffect(() => {
    if (!env.NEXT_PUBLIC_ENABLE_EMPLOYER_APPLICANT_DRILLDOWN) return;
    getApplicationDetail(jobId, appId).then(setApp).catch(() => setApp(null));
    if (env.NEXT_PUBLIC_ENABLE_INTERVIEWS) {
      fetch(`/api/employer/jobs/${jobId}/applicants/${appId}/interviews`)
        .then((r) => (r.ok ? r.json() : []))
        .then((d) => setInterviews(d as Interview[]))
        .catch(() => setInterviews([]));
    }
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

  const addSlot = () => {
    if (slotInputs.length < 3) setSlotInputs([...slotInputs, '']);
  };
  const updateSlot = (i: number, v: string) => {
    const arr = [...slotInputs];
    arr[i] = v;
    setSlotInputs(arr);
  };
  const removeSlot = (i: number) => {
    setSlotInputs(slotInputs.filter((_, idx) => idx !== i));
  };
  const submitInvite = async () => {
    const slots = slotInputs
      .filter(Boolean)
      .map((s) => ({ at: new Date(s).toISOString() }))
      .filter((s) => new Date(s.at).getTime() > Date.now());
    if (!slots.length) {
      toast(t('select_time'));
      return;
    }
    if ((method === 'in-person' || method === 'video') && !location.trim()) {
      toast(t('location_link'));
      return;
    }
    try {
      const r = await fetch(`/api/employer/jobs/${jobId}/applicants/${appId}/interviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, location: location || undefined, slots, note: inviteNote || undefined }),
      });
      if (!r.ok) throw new Error('fail');
      const interview = (await r.json()) as Interview;
      setInterviews([...interviews, interview]);
      setShowInvite(false);
      setMethod('phone');
      setLocation('');
      setSlotInputs(['']);
      setInviteNote('');
      if (app) {
        setApp({ ...app, events: [{ at: new Date().toISOString(), type: 'note', note: 'Proposed interview' }, ...app.events] });
      }
      toast(t('saved'));
    } catch {
      toast(t('withdraw_error'));
    }
  };

  const cancelInterview = async (id: string) => {
    try {
      const r = await fetch(`/api/employer/jobs/${jobId}/applicants/${appId}/interviews`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'cancelled' }),
      });
      if (!r.ok) throw new Error('fail');
      const updated = (await r.json()) as Interview;
      setInterviews(interviews.map((i) => (i.id === id ? updated : i)));
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
          {env.NEXT_PUBLIC_ENABLE_INTERVIEWS && (
            <button
              onClick={() => setShowInvite(true)}
              className="bg-green-500 text-white px-2 py-1 rounded text-sm"
            >
              {t('interview')}
            </button>
          )}
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
            {env.NEXT_PUBLIC_ENABLE_INTERVIEWS && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">{t('interview')}s</h3>
                <ul className="space-y-2">
                  {interviews.map((iv) => (
                    <li key={iv.id} className="border p-2 rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{iv.status}</span>
                        {iv.status === 'proposed' && (
                          <button
                            onClick={() => cancelInterview(iv.id)}
                            className="text-red-600 text-sm"
                          >
                            {t('cancel')}
                          </button>
                        )}
                      </div>
                      <div className="text-xs">
                        {iv.slots.map((s, i) => (
                          <div key={i}>{new Date(s.at).toLocaleString()}</div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
      {showInvite && env.NEXT_PUBLIC_ENABLE_INTERVIEWS && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-96 space-y-2">
            <h3 className="font-semibold">{t('propose_interview')}</h3>
            <select
              value={method}
              onChange={(e) =>
                setMethod(e.target.value as 'in-person' | 'phone' | 'video')
              }
              className="border p-1 w-full"
            >
              <option value="in-person">In-person</option>
              <option value="phone">Phone</option>
              <option value="video">Video</option>
            </select>
            {(method === 'in-person' || method === 'video') && (
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('location_link')}
                className="border p-1 w-full"
              />
            )}
            {slotInputs.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  value={s}
                  onChange={(e) => updateSlot(i, e.target.value)}
                  className="border p-1 w-full"
                />
                {slotInputs.length > 1 && (
                  <button onClick={() => removeSlot(i)} className="text-sm">
                    &times;
                  </button>
                )}
              </div>
            ))}
            {slotInputs.length < 3 && (
              <button onClick={addSlot} className="text-sm text-blue-600">
                +
              </button>
            )}
            <textarea
              value={inviteNote}
              onChange={(e) => setInviteNote(e.target.value)}
              placeholder={t('add_note')}
              className="border p-1 w-full"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowInvite(false)} className="px-2 py-1">
                {t('cancel')}
              </button>
              <button onClick={submitInvite} className="bg-blue-600 text-white px-2 py-1 rounded">
                {t('propose_interview')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

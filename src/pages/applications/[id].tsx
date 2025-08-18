import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import HeadSEO from '@/components/HeadSEO';
import { env } from '@/config/env';
import { toast } from '@/lib/toast';
import { t } from '@/lib/i18n';
import type { ApplicationDetail, ApplicationEvent, ApplicationStatus } from '@/types/applications';
import type { Interview } from '@/src/types/interview';
import InterviewForm from '@/product/interviews/InterviewForm';
import { interviewsEnabled } from '@/src/lib/interviews';

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  if (!env.NEXT_PUBLIC_ENABLE_APPLICATION_DETAIL) return { notFound: true } as const;
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const r = await fetch(`${base}/api/session/me`, {
      headers: { cookie: req.headers.cookie || '' },
    });
    if (!r.ok) {
      return {
        redirect: {
          destination: `/login?return=/applications/${params?.id}`,
          permanent: false,
        },
      } as const;
    }
  } catch {
    return {
      redirect: {
        destination: `/login?return=/applications/${params?.id}`,
        permanent: false,
      },
    } as const;
  }
  return { props: { id: params?.id || '' } } as const;
};

function statusColor(status: ApplicationStatus) {
  const map: Record<ApplicationStatus, string> = {
    new: 'bg-gray-200 text-gray-800',
    reviewing: 'bg-blue-200 text-blue-800',
    shortlisted: 'bg-green-200 text-green-800',
    rejected: 'bg-red-200 text-red-800',
    hired: 'bg-green-300 text-green-900',
    withdrawn: 'bg-gray-300 text-gray-700',
    interviewing: 'bg-blue-200 text-blue-800',
    offer_made: 'bg-yellow-200 text-yellow-800',
    offer_accepted: 'bg-green-200 text-green-800',
    offer_declined: 'bg-red-200 text-red-800',
    not_selected: 'bg-gray-300 text-gray-700',
  };
  return map[status];
}

const statusLabels: Record<ApplicationStatus, string> = {
  new: t('status_new'),
  reviewing: t('status_reviewing'),
  shortlisted: t('status_shortlisted'),
  rejected: t('status_rejected'),
  hired: t('status_hired'),
  withdrawn: t('status_withdrawn'),
  interviewing: 'interviewing',
  offer_made: 'offer_made',
  offer_accepted: 'offer_accepted',
  offer_declined: 'offer_declined',
  not_selected: 'not_selected',
};

function groupEvents(events: ApplicationEvent[]) {
  const today: ApplicationEvent[] = [];
  const week: ApplicationEvent[] = [];
  const earlier: ApplicationEvent[] = [];
  const now = Date.now();
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  events.forEach((e) => {
    const t = new Date(e.at).getTime();
    if (t >= startOfToday) today.push(e);
    else if (now - t < 7 * 24 * 60 * 60 * 1000) week.push(e);
    else earlier.push(e);
  });
  return { today, week, earlier };
}

export default function ApplicationDetailPage({ id }: { id: string }) {
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch(`/api/applications/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: ApplicationDetail) => {
        setApp(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
    if (interviewsEnabled()) {
      fetch(`/api/interviews?appId=${id}`)
        .then((r) => (r.ok ? r.json() : { interviews: [] }))
        .then((d) => setInterviews(d.interviews || []))
        .catch(() => setInterviews([]));
    }
  }, [id]);

  const withdraw = async () => {
    if (!app) return;
    if (!window.confirm(t('confirm_withdraw'))) return;
    try {
      const r = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'withdraw' }),
      });
      if (!r.ok) throw new Error('fail');
      const d = (await r.json()) as ApplicationDetail;
      setApp(d);
      toast(t('withdraw_success'));
    } catch {
      toast(t('withdraw_error'));
    }
  };

  const refreshInterviews = () => {
    fetch(`/api/interviews?appId=${id}`)
      .then((r) => (r.ok ? r.json() : { interviews: [] }))
      .then((d) => setInterviews(d.interviews || []))
      .catch(() => setInterviews([]));
  };

  if (loading) {
    return (
      <main className="qg-container py-8">
        <div className="animate-pulse h-4 w-1/2 mb-4 bg-gray-200" />
        <div className="animate-pulse h-4 w-1/3 bg-gray-200" />
      </main>
    );
  }
  if (error || !app) {
    return (
      <main className="qg-container py-8">
        <p>Error loading application.</p>
      </main>
    );
  }

  const groups = groupEvents(app.events);

  return (
    <>
      <HeadSEO title="Application | QuickGig" />
      <main className="qg-container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{app.jobTitle}</h1>
            {app.company && <div className="text-gray-600">{app.company}</div>}
          </div>
          <span className={`px-2 py-1 rounded text-sm ${statusColor(app.status)}`}>{statusLabels[app.status]}</span>
        </div>
        {app.status !== 'withdrawn' && app.status !== 'rejected' && app.status !== 'hired' && (
          <button
            onClick={withdraw}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            {t('withdraw_application')}
          </button>
        )}
        {interviewsEnabled() && (
          <section className="border p-4 rounded space-y-2">
          <h3 className="font-semibold mb-2">{t('interviews.section_title')}</h3>
          {interviews.map((iv) => (
            <div key={iv.id} className="flex items-center justify-between text-sm">
              <span>{new Date(iv.whenISO).toLocaleString()}</span>
              <span className="capitalize px-2 py-1 bg-gray-100 rounded">
                {iv.status}
              </span>
            </div>
          ))}
          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
          >
            {t('interviews.propose_cta')}
          </button>
          {showForm && (
            <InterviewForm
              appId={id}
              jobId={app.jobId}
              employerId=""
              applicantId=""
              onDone={() => {
                setShowForm(false);
                refreshInterviews();
              }}
            />
          )}
        </section>
        )}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {groups.today.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">{t('timeline_today')}</h3>
                <ul className="space-y-2">
                  {groups.today.map((e, i) => (
                    <li key={`t${i}`}>{e.type}{e.note ? `: ${e.note}` : ''}</li>
                  ))}
                </ul>
              </div>
            )}
            {groups.week.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">{t('timeline_week')}</h3>
                <ul className="space-y-2">
                  {groups.week.map((e, i) => (
                    <li key={`w${i}`}>{e.type}{e.note ? `: ${e.note}` : ''}</li>
                  ))}
                </ul>
              </div>
            )}
            {groups.earlier.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">{t('timeline_earlier')}</h3>
                <ul className="space-y-2">
                  {groups.earlier.map((e, i) => (
                    <li key={`e${i}`}>{e.type}{e.note ? `: ${e.note}` : ''}</li>
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
            <Link href={`/jobs/${app.jobId}`} className="block text-blue-600 hover:underline">
              View job
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

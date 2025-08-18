'use client';
import { useEffect, useState } from 'react';
import HeadSEO from '@/components/HeadSEO';
import { listJobs, countApplicantsForEmployer } from '@/lib/employerStore';
import type { EmployerJob } from '@/lib/employerStore';
import { t } from '@/lib/i18n';

function Card({ title, value, bars }: { title: string; value: number; bars?: number[] }) {
  return (
    <div className="border rounded p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {bars && (
        <svg viewBox="0 0 70 20" className="mt-2 w-full h-4">
          {bars.map((v, i) => (
            <rect key={i} x={i * 10} y={20 - v} width="8" height={v} fill="#2563eb" />
          ))}
        </svg>
      )}
    </div>
  );
}

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [applicants, setApplicants] = useState(0);
  const [unread, setUnread] = useState(0);
  const [views, setViews] = useState(0);

  useEffect(() => {
    listJobs().then((j) => {
      setJobs(j);
      setViews(j.reduce((sum, job) => sum + (job.metrics?.views || 0), 0));
    });
    countApplicantsForEmployer().then((n) => setApplicants(n));
    fetch('/api/msg/list')
      .then((r) => r.json())
      .then((j) => {
        const items = Array.isArray(j.items) ? j.items : [];
        const c = items.filter((i: { unread?: boolean }) => i.unread).length;
        setUnread(c);
      })
      .catch(() => setUnread(0));
  }, []);

  const active = jobs.filter((j) => j.status === 'published').length;
  const bars = Array.from({ length: 7 }).map(() => Math.min(20, Math.round(views / 7)));

  return (
    <>
      <HeadSEO title="Employer dashboard | QuickGig" />
      <main className="p-4 space-y-4">
        <h1 className="text-xl font-semibold">{t('dashboard')}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card title={t('active_jobs')} value={active} />
          <Card title={t('applicants')} value={applicants} />
          <Card title={t('unread_messages')} value={unread} />
          <Card title={t('views')} value={views} bars={bars} />
        </div>
      </main>
    </>
  );
}

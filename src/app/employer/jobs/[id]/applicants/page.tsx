'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { t } from '@/lib/i18n';
import type { ApplicationSummary } from '@/types/application';
import InterviewForm from '@/components/interviews/InterviewForm';

const STATUSES = ['new','reviewing','shortlisted','interviewing','rejected','hired','withdrawn'];

export default function ApplicantsList({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const search = useSearchParams();
  const [apps, setApps] = useState<ApplicationSummary[]>([]);
  const [status, setStatus] = useState<string[]>(
    search ? search.get('status')?.split(',').filter(Boolean) || [] : [],
  );
  const [query, setQuery] = useState(search ? search.get('query') || '' : '');
  const [showForm, setShowForm] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/applications')
      .then((r) => (r.ok ? r.json() : []))
      .then((d: ApplicationSummary[]) => setApps(d.filter((a) => a.jobId === id)));
  }, [id]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status.length) params.set('status', status.join(','));
    if (query) params.set('query', query);
    router.replace(`?${params.toString()}`);
  }, [status, query, router]);

  const filtered = apps.filter((a) => {
    const matchStatus = !status.length || status.includes(a.status as unknown as string);
    const q = query.toLowerCase();
    const matchQuery = !q || a.id.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">{t('applicants')}</h1>
      <div className="flex gap-4 items-center">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <label key={s} className="text-sm">
              <input
                type="checkbox"
                checked={status.includes(s)}
                onChange={(e) =>
                  setStatus(
                    e.target.checked ? [...status, s] : status.filter((x) => x !== s),
                  )
                }
                className="mr-1"
              />
              {s}
            </label>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="border p-1"
        />
      </div>
      <ul className="space-y-2">
        {filtered.map((a) => (
          <li key={a.id} className="border p-2 rounded flex justify-between items-center">
            <span>
              {a.id} - {a.status}
            </span>
            <button
              onClick={() => setShowForm(a.id)}
              className="text-sm text-blue-600"
            >
              {t('interviews.invite')}
            </button>
          </li>
        ))}
      </ul>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow">
            <InterviewForm
              jobId={id}
              applicantId={showForm}
              onCreated={() => setShowForm(null)}
              onClose={() => setShowForm(null)}
            />
          </div>
        </div>
      )}
    </main>
  );
}

import { useEffect, useState } from 'react';
import HeadSEO from '@/components/HeadSEO';
import InterviewRow from '@/components/interviews/InterviewRow';
import { listByUser, updateInterview } from '@/lib/interviews';
import type { Interview } from '@/types/interview';
import { t } from '@/lib/i18n';
import { toast } from '@/lib/toast';
import { env } from '@/config/env';
import type { GetServerSidePropsContext } from 'next';
import { api } from '@/config/api';

export default function EmployerInterviewsPage() {
  const [items, setItems] = useState<Interview[]>([]);
  useEffect(() => {
    listByUser('employer').then(setItems).catch(() => setItems([]));
  }, []);
  const act = async (id: string, status: Interview['status']) => {
    const updated = await updateInterview(id, { status });
    setItems(items.map((i) => (i.id === id ? updated : i)));
    toast(t('interviews.updated'));
  };
  return (
    <main className="p-4 space-y-4">
      <HeadSEO title={t('interviews.title')} />
      <h1 className="text-xl font-semibold">{t('interviews.title')}</h1>
      <div>
        {items.map((iv) => (
          <div key={iv.id} className="mb-2">
            <InterviewRow interview={iv} />
            {iv.status === 'proposed' && (
              <div className="flex gap-2 text-sm mt-1">
                <button
                  onClick={() => act(iv.id, 'accepted')}
                  className="px-2 py-1 border"
                >
                  {t('interviews.accept')}
                </button>
                <button
                  onClick={() => act(iv.id, 'declined')}
                  className="px-2 py-1 border"
                >
                  {t('interviews.decline')}
                </button>
                <button
                  onClick={() => act(iv.id, 'cancelled')}
                  className="px-2 py-1 border"
                >
                  {t('interviews.cancel')}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  if (!env.NEXT_PUBLIC_ENABLE_INTERVIEWS_UI) return { notFound: true };
  const cookie = req.headers.cookie || '';
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const userRes = await fetch(base + api.session.me, {
    headers: { cookie },
  });
  const user = userRes.ok ? await userRes.json() : null;
  if (!user) return { redirect: { destination: '/login', permanent: false } };
  if (!user.isEmployer)
    return { redirect: { destination: '/interviews', permanent: false } };
  return { props: {} };
}

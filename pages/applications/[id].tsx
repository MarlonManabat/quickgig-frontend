import type { GetServerSideProps } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Thread from '@/components/messages/Thread';
import MessageInput from '@/components/messages/MessageInput';

interface AppDetail {
  id: string;
  job_id: string;
  worker_id: string;
  status: string;
  job?: { title?: string; employer_id?: string } | null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { redirect: { destination: '/auth', permanent: false } };
  const id = ctx.params?.id as string;
  const { data } = await supabase
    .from('applications')
    .select('id,job_id,worker_id,status,job:jobs(title,employer_id)')
    .eq('id', id)
    .maybeSingle();
  if (!data) return { notFound: true };
  if (user.id !== data.worker_id && user.id !== data.job?.employer_id)
    return { redirect: { destination: '/', permanent: false } };
  const otherId =
    user.id === data.worker_id ? data.job?.employer_id : data.worker_id;
  let counterpartyName = '';
  if (otherId) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', otherId)
      .maybeSingle();
    counterpartyName = prof?.full_name || '';
  }
  return { props: { app: data, counterpartyName } };
};

export default function ApplicationDetail({ app, counterpartyName }: { app: AppDetail; counterpartyName: string }) {
  const [status, setStatus] = useState(app.status);
  useEffect(() => {
    const ch = supabase
      .channel('app-status')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'applications', filter: `id=eq.${app.id}` },
        (payload) => {
          const s = (payload.new as any).status as string;
          setStatus(s);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [app.id]);

  const statusCls =
    status === 'accepted'
      ? 'bg-green-100 text-green-800'
      : status === 'declined'
      ? 'bg-red-100 text-red-800'
      : 'bg-gray-200';

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {app.job?.title || app.job_id}
          </h1>
          {counterpartyName && (
            <p className="text-sm text-brand-subtle">{counterpartyName}</p>
          )}
        </div>
        <span className={`inline-block rounded px-2 py-1 text-sm ${statusCls}`}>
          {status}
        </span>
      </header>
      <Thread applicationId={app.id} />
      <MessageInput applicationId={app.id} />
    </main>
  );
}

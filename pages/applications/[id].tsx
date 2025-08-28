import type { GetServerSideProps } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

interface AppDetail {
  id: string;
  job_id: string;
  worker_id: string;
  message: string;
  expected_rate: number;
  status: string;
  job?: { title?: string } | null;
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
    .select('id,job_id,worker_id,message,expected_rate,status,job:jobs(title)')
    .eq('id', id)
    .maybeSingle();
  if (!data) return { notFound: true };
  return { props: { app: data } };
};

export default function ApplicationDetail({ app }: { app: AppDetail }) {
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Application</h1>
      <p className="text-sm">Job: {app.job?.title || app.job_id}</p>
      <p>Status: <span className="inline-block rounded bg-gray-200 px-2 py-1 text-sm">{app.status}</span></p>
      <div>
        <h2 className="font-semibold">Message</h2>
        <p>{app.message}</p>
      </div>
      <div>
        <h2 className="font-semibold">Expected rate</h2>
        <p>{app.expected_rate}</p>
      </div>
    </main>
  );
}

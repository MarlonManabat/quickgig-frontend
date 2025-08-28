import type { GetServerSideProps } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import CreditsGate from '@/components/credits/CreditsGate';
import NewJobForm from '@/components/jobs/NewJobForm';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { redirect: { destination: '/auth', permanent: false } };
  }
  const { data } = await supabase
    .from('user_credits')
    .select('credits')
    .eq('user_id', user.id)
    .maybeSingle();
  const credits = data?.credits ?? 0;
  return { props: { credits } };
};

export default function NewJobPage({ credits }: { credits: number }) {
  if (credits <= 0) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <CreditsGate />
      </main>
    );
  }
  return (
    <main className="max-w-2xl mx-auto p-6" data-testid="job-form">
      <NewJobForm />
    </main>
  );
}

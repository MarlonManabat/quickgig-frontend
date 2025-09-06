import { notFound } from 'next/navigation';
import LinkApp from '@/components/LinkApp';
import ApplyButton from '@/components/ApplyButton';
import { loginNext } from '@/app/lib/authAware';
import { ROUTES } from '@/lib/routes';
import { supabaseServer } from '@/lib/supabase/server';
import { MOCK_MODE } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function JobDetail({ params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  let job: any = null;
  let user: any = null;
  let isMock = false;
  if (!supabase || MOCK_MODE) {
    job = { id: params.id, title: 'Mock Job', description: 'Temporary preview' };
    isMock = true;
  } else {
    const { data } = await supabase
      .from('jobs')
      .select('id,title,description,category,region,city')
      .eq('id', params.id)
      .maybeSingle();
    if (!data) notFound();
    job = data;
    const { data: userData } = await supabase.auth.getUser();
    user = userData.user;
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      <p>{job.description}</p>
      {user ? (
        <ApplyButton jobId={job.id} />
      ) : (
        <LinkApp
          href={loginNext(ROUTES.applications)}
          data-testid="apply-button"
          data-cta="apply-open"
          className="inline-block rounded bg-black text-white px-4 py-2"
        >
          Apply
        </LinkApp>
      )}
      {isMock ? <span className="sr-only">mock</span> : null}
    </div>
  );
}

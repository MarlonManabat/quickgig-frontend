import { notFound } from 'next/navigation';
import LinkApp from '@/components/LinkApp';
import ApplyButton from '@/components/ApplyButton';
import { loginNext } from '@/app/lib/authAware';
import { ROUTES } from '@/lib/routes';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function JobDetail({ params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  if (!supabase) notFound();
  const { data } = await supabase
    .from('jobs')
    .select('id,title,description,category,region,city')
    .eq('id', params.id)
    .maybeSingle();
  if (!data) notFound();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{data.title}</h1>
      <p>{data.description}</p>
      {user ? (
        <ApplyButton jobId={data.id} />
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
    </div>
  );
}

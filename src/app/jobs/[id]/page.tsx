import { notFound } from 'next/navigation';
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
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4" data-qa="post-job-success" data-testid="post-job-success">
      <h1 className="text-2xl font-semibold">{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}

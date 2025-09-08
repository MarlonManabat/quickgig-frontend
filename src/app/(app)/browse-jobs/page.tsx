import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { ensurePreviewSeed } from '@/app/(app)/_lib/ensurePreviewSeed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BrowseJobsPage() {
  await ensurePreviewSeed();
  const supabase = supabaseServer();
  let jobs: { id: string; title: string }[] = [];
  if (supabase) {
    const { data } = await supabase
      .from('jobs')
      .select('id,title')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(50);
    jobs = data ?? [];
  }

  if (jobs.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Browse jobs</h1>
        <p data-testid="jobs-empty" className="opacity-70">No jobs yet</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Browse jobs</h1>
      <section data-testid="jobs-list" className="space-y-3">
        {jobs.map((j) => (
          <div key={j.id} data-testid="job-card" className="rounded-xl border p-4">
            <Link href={`/jobs/${j.id}`}>{j.title}</Link>
          </div>
        ))}
      </section>
    </div>
  );
}

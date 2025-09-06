import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { MOCK_MODE } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BrowseJobsPage() {
  const supabase = supabaseServer();
  type Job = { id: string; title: string; region?: string; city?: string };
  let jobs: Job[] = [];
  let isMock = false;
  if (!supabase || MOCK_MODE) {
    jobs = [
      { id: 'mock-1', title: 'Sample Job A', region: 'NCR', city: 'Manila' },
      { id: 'mock-2', title: 'Sample Job B', region: 'Region IV-A', city: 'Cavite' },
    ];
    isMock = true;
  } else {
    const { data } = await supabase
      .from('jobs')
      .select('id,title,region,city')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(20);
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
      <div data-testid="jobs-list" className="space-y-3">
        {jobs.map((j) => (
          <article key={j.id} data-testid="job-card" className="rounded-xl border p-4">
            <Link href={`/jobs/${j.id}`}>{j.title}</Link>
            {j.region && j.city ? <div>{j.region} · {j.city}</div> : null}
            {isMock ? <span className="sr-only">mock</span> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

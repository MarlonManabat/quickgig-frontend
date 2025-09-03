// @ts-nocheck
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { supabaseServer } from '@/lib/supabase/server';

export default async function BrowseJobsPage() {
  const supabase = supabaseServer();
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[browse-jobs] load error:', error);
  }

  return (
    <main className="container mx-auto max-w-full sm:max-w-screen-lg px-4 py-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4">Browse jobs</h1>
      {jobs && jobs.length > 0 ? (
        <ul className="space-y-3">
          {jobs.map((j) => (
            <li key={j.id} className="rounded-xl border p-4">
              <div className="font-medium">{j.title}</div>
              <div className="opacity-70 text-sm">{j.company ?? '—'}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="opacity-70">No jobs yet</p>
      )}
    </main>
  );
}


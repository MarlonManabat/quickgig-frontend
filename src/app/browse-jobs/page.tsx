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
    <div className="mx-auto max-w-screen-md px-4 sm:px-6 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Browse jobs</h1>
      {jobs && jobs.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {jobs.map((j) => (
            <li key={j.id} className="rounded-lg border p-3">
              <div className="font-medium">{j.title}</div>
              <div className="text-sm opacity-70">{j.company ?? '—'}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="opacity-70">No jobs yet</p>
      )}
    </div>
  );
}


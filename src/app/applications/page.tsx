import Link from 'next/link';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/routes';
import { toAppPath } from '@/lib/routes';
import { loginNext } from '@/app/lib/authAware';
import { MOCK_MODE } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ApplicationsPage() {
  const supabase = supabaseServer();
  if (!supabase || MOCK_MODE) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold mb-4">My Applications</h1>
        <div
          data-testid="applications-empty"
          data-qa="applications-empty"
          className="opacity-70 space-y-3"
        >
          <p>No applications yet</p>
          <Link
            href={ROUTES.browseJobs}
            data-cta="browse-jobs-from-empty"
            data-testid="browse-jobs-from-empty"
            className="underline"
          >
            Browse jobs
          </Link>
        </div>
        <span className="sr-only">mock</span>
      </div>
    );
  }

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  const dest = toAppPath(ROUTES.applications);
  if (!user) {
    redirect(loginNext(dest));
  }

  const { data: rows } = await supabase
    .from('applications')
    .select('id,status,created_at,job:jobs(id,title)')
    .eq('worker_id', user.id)
    .order('created_at', { ascending: false });
  const applications = rows ?? [];

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">My Applications</h1>
      {applications.length > 0 ? (
        <ul data-testid="applications-list" className="space-y-3">
          {applications.map((a: any) => (
            <li key={a.id} data-testid="application-row" className="rounded-xl border p-4">
              <div className="font-medium">
                <Link href={`/jobs/${a.job?.id}`}>{a.job?.title}</Link>
              </div>
              <div className="text-sm">{a.status}</div>
              <div className="text-sm opacity-70">{new Date(a.created_at).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div
          data-testid="applications-empty"
          data-qa="applications-empty"
          className="opacity-70 space-y-3"
        >
          <p>No applications yet</p>
          <Link
            href={ROUTES.browseJobs}
            data-cta="browse-jobs-from-empty"
            data-testid="browse-jobs-from-empty"
            className="underline"
          >
            Browse jobs
          </Link>
        </div>
      )}
    </div>
  );
}

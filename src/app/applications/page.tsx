import Link from 'next/link';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/routes';
import { toAppPath } from '@/lib/routes';
import { loginNext } from '@/app/lib/authAware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ApplicationsPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  const dest = toAppPath(ROUTES.applications);
  if (!user) {
    redirect(loginNext(dest));
  }

  const applications: any[] = [];

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">My Applications</h1>
      <ul data-testid="applications-list" className="space-y-3">
        {applications.map((a) => (
          <li key={a.id} data-testid="application-row" className="rounded-xl border p-4">
            <div className="font-medium">{a.title}</div>
          </li>
        ))}
      </ul>
      {applications.length === 0 && (
        <div data-testid="applications-empty" className="mt-4 text-center space-y-4">
          <p className="opacity-70">You have not applied to any jobs yet.</p>
          <Link
            href={ROUTES.browseJobs}
            data-testid="hero-browse-jobs"
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white"
          >
            Browse jobs
          </Link>
        </div>
      )}
    </div>
  );
}

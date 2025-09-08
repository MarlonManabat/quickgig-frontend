import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeededJobs } from '@/app/lib/seed';
import { loginNext } from '@/app/lib/authAware';
import { ROUTES } from '@/lib/routes';
import { toAppPath } from '@/lib/routes';
import { getSupabaseServer } from '@/app/lib/supabase.server';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const jobs = await getSeededJobs();
  const job = jobs.find((j) => j.id === params.id);
  if (!job) {
    notFound();
  }

  const supabase = getSupabaseServer();
  // In preview / mock environments Supabase may be unavailable.
  // Guard to avoid "Cannot read properties of null (reading 'auth')".
  let user: import("@supabase/supabase-js").User | null = null;
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error) user = data?.user ?? null;
    } catch {
      user = null; // tolerate missing auth in preview/mocks
    }
  }

  const dest = toAppPath(ROUTES.applications);
  const href = user ? dest : loginNext(dest);

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      <p>{job.description}</p>
      <Link data-testid="apply-button" href={href} className="inline-block rounded bg-blue-600 px-4 py-2 text-white">
        Apply
      </Link>
    </div>
  );
}

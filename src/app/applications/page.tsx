import { redirect } from 'next/navigation';
import { createServerClientSafe } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/routes';
import { toAppPath } from '@/lib/routes';
import { loginNext } from '@/app/lib/authAware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ApplicationsPage() {
  const supabase = createServerClientSafe();
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
        <p data-testid="applications-empty" className="opacity-70">No applications yet</p>
      )}
    </div>
  );
}

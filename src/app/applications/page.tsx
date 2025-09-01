import ApplicationList from '@/components/applications/ApplicationList';
import { getOrigin } from '@/lib/origin';
import type { Application } from '@/types/applications';

export const dynamic = 'force-dynamic';

export default async function MyApplications() {
  const res = await fetch(`${getOrigin()}/api/applications`, {
    cache: 'no-store',
  });
  const data = await res.json();
  const apps: Application[] = data.applications ?? [];
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold mb-4">My applications</h1>
      <ApplicationList items={apps} />
    </main>
  );
}

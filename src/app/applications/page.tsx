import { getOrigin } from '@/lib/origin';
import ApplicationsPageClient from './ApplicationsPageClient';
import type { Application } from '@/types/db';

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
      <ApplicationsPageClient initialApps={apps} />
    </main>
  );
}


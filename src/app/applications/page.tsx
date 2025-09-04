'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { loginNext } from '@/app/lib/authAware';
import { isSignedIn } from '@/lib/devAuth';
import { getApplications, ApplicationItem } from '@/lib/applicationsStore';

export default function ApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<ApplicationItem[]>([]);

  useEffect(() => {
    if (!isSignedIn()) {
      router.replace(loginNext(ROUTES.applications));
      return;
    }
    setApps(getApplications());
  }, [router]);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">My Applications</h1>
      <ul data-testid="applications-list" className="space-y-3">
        {apps.map((a) => (
          <li key={a.id} data-testid="application-row" className="rounded-xl border p-4">
            <div className="font-medium">{a.title}</div>
          </li>
        ))}
      </ul>
      {apps.length === 0 && (
        <p data-testid="applications-empty" className="opacity-70">
          No applications yet.
        </p>
      )}
    </div>
  );
}

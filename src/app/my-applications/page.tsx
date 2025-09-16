import 'server-only';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';

type Application = {
  id: string | number;
  jobTitle?: string;
  company?: string;
  status?: string;
  appliedAt?: string;
};

async function fetchApplications(): Promise<Application[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) return [];

  try {
    const cookieHeader = cookies().toString();
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/applications`, {
      cache: 'no-store',
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      credentials: 'include',
    });

    if (response.status === 401) {
      return [];
    }

    if (!response.ok) {
      throw new Error(String(response.status));
    }

    const body = await response.json();
    const rawList: any[] = Array.isArray((body as any)?.applications)
      ? (body as any).applications
      : Array.isArray(body)
      ? (body as any)
      : [];

    return rawList.map((application: any) => ({
      id:
        application?.id ??
        application?.applicationId ??
        application?.jobId ??
        randomUUID(),
      jobTitle:
        application?.jobTitle ??
        application?.title ??
        application?.job?.title ??
        'Untitled job',
      company:
        application?.company ??
        application?.job?.company ??
        application?.org?.name ??
        '—',
      status: application?.status ?? application?.state ?? 'submitted',
      appliedAt: application?.appliedAt ?? application?.createdAt ?? undefined,
    }));
  } catch {
    return [];
  }
}

export default async function MyApplicationsPage() {
  const applications = await fetchApplications();
  const hasApplications = applications.length > 0;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">My Applications</h1>
      {hasApplications ? (
        <ul data-testid="applications-list" className="mt-6 divide-y">
          {applications.map((application) => (
            <li
              key={String(application.id)}
              data-testid="application-row"
              className="py-4"
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="font-medium">{application.jobTitle}</div>
                  <div className="text-sm text-slate-600">{application.company}</div>
                </div>
                <div className="text-sm text-slate-500">
                  {application.status ?? 'submitted'}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div
          data-testid="applications-empty"
          className="mt-6 rounded border border-dashed p-6 text-center text-slate-600"
        >
          You haven’t applied to any jobs yet.
        </div>
      )}
    </main>
  );
}

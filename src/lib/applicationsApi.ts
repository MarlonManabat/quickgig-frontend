import type { ApplicationSummary, ApplicationStatus } from '@/types/application';

async function unwrap<T>(res: Response): Promise<T> {
  const json = await res.json();
  return json && typeof json === 'object' && 'data' in json ? (json.data as T) : (json as T);
}

export async function fetchApplications(): Promise<ApplicationSummary[]> {
  const res = await fetch('/api/applications');
  if (!res.ok) throw new Error('Failed to fetch applications');
  return unwrap<ApplicationSummary[]>(res);
}

export async function fetchApplication(id: string): Promise<ApplicationSummary> {
  const res = await fetch(`/api/applications/${id}`);
  if (!res.ok) throw new Error('Failed to fetch application');
  return unwrap<ApplicationSummary>(res);
}

export async function patchApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<ApplicationSummary> {
  const res = await fetch(`/api/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update');
  return unwrap<ApplicationSummary>(res);
}

import type { ApplicationSummary, ApplicationStatus } from '@/types/application';

const LS_KEY = 'apps';
let memoryApps: ApplicationSummary[] | null = null;

function readApps(): ApplicationSummary[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as ApplicationSummary[]) : [];
  }
  return memoryApps || [];
}

function writeApps(apps: ApplicationSummary[]) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(LS_KEY, JSON.stringify(apps));
  } else {
    memoryApps = apps;
  }
}

export function seedMockApps() {
  const existing = readApps();
  if (existing.length) return;
  const now = new Date().toISOString();
  const sample: ApplicationSummary[] = [
    {
      id: '1',
      jobId: '1',
      jobTitle: 'Sample Job 1',
      company: 'Acme Corp',
      location: 'Manila',
      status: 'applied',
      submittedAt: now,
      updatedAt: now,
    },
    {
      id: '2',
      jobId: '2',
      jobTitle: 'Sample Job 2',
      company: 'Globex',
      location: 'Cebu',
      status: 'viewed',
      submittedAt: now,
      updatedAt: now,
    },
  ];
  writeApps(sample);
}

const MODE = process.env.ENGINE_MODE || 'mock';
const BASE = process.env.ENGINE_BASE_URL || '';

export async function listApplications(cookie?: string): Promise<ApplicationSummary[]> {
  if (MODE === 'mock') {
    seedMockApps();
    return readApps();
  }
  const res = await fetch(`${BASE}/api/applications`, {
    headers: { Cookie: cookie || '' },
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as ApplicationSummary[];
}

export async function getApplication(id: string, cookie?: string): Promise<ApplicationSummary | null> {
  if (MODE === 'mock') {
    const apps = await listApplications();
    return apps.find((a) => a.id === id) || null;
  }
  const res = await fetch(`${BASE}/api/applications/${id}`, {
    headers: { Cookie: cookie || '' },
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as ApplicationSummary;
}

export async function updateStatus(
  id: string,
  status: ApplicationStatus,
  cookie?: string,
): Promise<ApplicationSummary> {
  if (MODE === 'mock') {
    const apps = await listApplications();
    const idx = apps.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('not found');
    const updated: ApplicationSummary = {
      ...apps[idx],
      status,
      updatedAt: new Date().toISOString(),
    };
    apps[idx] = updated;
    writeApps(apps);
    return updated;
  }
  const res = await fetch(`${BASE}/api/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as ApplicationSummary;
}

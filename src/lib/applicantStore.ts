import type { ApplicationSummary } from '@/types/application';
import type { ApplicationDetail, ApplicationEvent } from '@/types/applications';

const LS_KEY = 'apps';
const DETAIL_KEY = 'app-details';
let memoryApps: ApplicationSummary[] | null = null;
let memoryDetails: Record<string, ApplicationDetail> | null = null;

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

function readDetails(): Record<string, ApplicationDetail> {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(DETAIL_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ApplicationDetail>) : {};
  }
  return memoryDetails || {};
}

function writeDetails(details: Record<string, ApplicationDetail>) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(DETAIL_KEY, JSON.stringify(details));
  } else {
    memoryDetails = details;
  }
}

export function seedMockApps() {
  const existing = readApps();
  if (!existing.length) {
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
  const details = readDetails();
  if (!Object.keys(details).length) {
    const now = new Date().toISOString();
    const map: Record<string, ApplicationDetail> = {};
    readApps().forEach((a) => {
      map[a.id] = {
        id: a.id,
        jobId: a.jobId,
        jobTitle: a.jobTitle,
        company: a.company,
        status: 'new',
        events: [{ at: now, type: 'new', by: 'applicant' }],
      };
    });
    writeDetails(map);
  }
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

export async function getApplication(
  id: string,
  cookie?: string,
): Promise<ApplicationDetail | null> {
  if (MODE === 'mock') {
    seedMockApps();
    const details = readDetails();
    return details[id] || null;
  }
  const res = await fetch(`${BASE}/api/applications/${id}`, {
    headers: { Cookie: cookie || '' },
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as ApplicationDetail;
}

export async function withdrawApplication(
  id: string,
  note?: string,
  cookie?: string,
): Promise<ApplicationDetail> {
  if (MODE === 'mock') {
    const details = readDetails();
    const app = details[id];
    if (!app) throw new Error('not found');
    const event: ApplicationEvent = {
      at: new Date().toISOString(),
      type: 'withdrawn',
      by: 'applicant',
      note,
    };
    app.status = 'withdrawn';
    app.events = [event, ...app.events];
    details[id] = app;
    writeDetails(details);
    return app;
  }
  const res = await fetch(`${BASE}/api/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify({ action: 'withdraw', note }),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as ApplicationDetail;
}

export async function appendEvent(
  id: string,
  event: ApplicationEvent,
  cookie?: string,
): Promise<ApplicationDetail> {
  if (MODE === 'mock') {
    const details = readDetails();
    const app = details[id];
    if (!app) throw new Error('not found');
    app.events = [event, ...app.events];
    details[id] = app;
    writeDetails(details);
    return app;
  }
  const res = await fetch(`${BASE}/api/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie || '' },
    body: JSON.stringify({ event }),
  });
  if (!res.ok) throw new Error(`engine ${res.status}`);
  return (await res.json()) as ApplicationDetail;
}

export { readApps };

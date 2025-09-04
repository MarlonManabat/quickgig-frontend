export interface ApplicationItem {
  id: string;
  title: string;
}

const KEY = 'DEV_APPS';

function read(): ApplicationItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ApplicationItem[]) : [];
  } catch {
    return [];
  }
}

export function getApplications(): ApplicationItem[] {
  return read();
}

export function addApplication(job: ApplicationItem) {
  if (typeof window === 'undefined') return;
  const apps = read();
  if (!apps.find((a) => a.id === job.id)) {
    apps.push(job);
    window.localStorage.setItem(KEY, JSON.stringify(apps));
  }
}

export const ROUTES = {
  browseJobs: '/browse-jobs',
  postJob: '/gigs/create',
  applications: '/applications',
  login: '/login',
} as const;

export function toAppPath(path: string): string {
  const origin = process.env.NEXT_PUBLIC_APP_ORIGIN;
  if (!origin) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${normalized}`;
}

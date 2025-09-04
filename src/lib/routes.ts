export const ROUTES = {
  browseJobs: '/browse-jobs',
  postJob: '/gigs/create',
  applications: '/applications',
  login: '/login',
} as const;

export function toAppPath(p: string) {
  const origin = process.env.NEXT_PUBLIC_APP_ORIGIN;
  return origin ? new URL(p, origin).toString() : p;
}

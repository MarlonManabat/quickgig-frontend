export const ROUTES = {
  browseJobs: '/browse-jobs',
  postJob: '/gigs/create',
  applications: '/applications',
  login: '/login',
} as const;
export type AppRoute = typeof ROUTES[keyof typeof ROUTES];

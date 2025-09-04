// Canonical app routes for cross-origin CTAs
export const ROUTES = {
  BROWSE_JOBS: '/browse-jobs',
  GIGS_CREATE: '/gigs/create',
  APPLICATIONS: '/applications',
  LOGIN: '/login',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];

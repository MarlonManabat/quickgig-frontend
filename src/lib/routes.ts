export const ROUTES = {
  home: '/',
  browseJobs: '/browse-jobs',
  postJob: '/gigs/create',
  applications: '/applications',
  login: '/login',
  signup: '/signup',
  logout: '/logout',
  tickets: '/tickets',
  ticketsBuy: '/tickets/buy',
  agreements: '/agreements',
  billingTickets: '/billing/tickets',
  accountTickets: '/account/tickets',
  adminTickets: '/admin/tickets',
} as const;
export type AppPath = (typeof ROUTES)[keyof typeof ROUTES];

export function toAppPath(path: AppPath): string {
  const origin = process.env.NEXT_PUBLIC_APP_ORIGIN;
  return origin ? new URL(path, origin).toString() : path;
}

export const NAV_ITEMS = [
  {
    key: 'browse-jobs',
    label: 'Browse jobs',
    to: ROUTES.browseJobs,
    idDesktop: 'nav-browse-jobs-header',
    idMobile: 'nav-browse-jobs-menu',
    auth: 'none',
  },
  {
    key: 'post-job',
    label: 'Post a job',
    to: ROUTES.postJob,
    idDesktop: 'nav-post-job-header',
    idMobile: 'nav-post-job-menu',
    auth: 'auth-aware',
  },
  {
    key: 'applications',
    label: 'My Applications',
    to: ROUTES.applications,
    idDesktop: 'nav-my-applications-header',
    idMobile: 'nav-my-applications-menu',
    auth: 'auth-aware',
  },
  {
    key: 'tickets',
    label: 'Tickets',
    to: ROUTES.tickets,
    idDesktop: 'nav-tickets-header',
    idMobile: 'nav-tickets-menu',
    auth: 'auth-aware',
  },
  {
    key: 'login',
    label: 'Login',
    to: ROUTES.login,
    idDesktop: 'nav-login-header',
    idMobile: 'nav-login-menu',
    auth: 'none',
  },
] as const;

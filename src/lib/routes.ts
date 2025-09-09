export const ROUTES = {
  home: '/',
  browseJobs: '/browse-jobs',
  postJob: '/post-job',
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
    idDesktop: 'nav-browse-jobs',
    idMobile: 'nav-browse-jobs',
    auth: 'none',
  },
  {
    key: 'post-job',
    label: 'Post a job',
    to: ROUTES.postJob,
    idDesktop: 'nav-post-job',
    idMobile: 'nav-post-job',
    auth: 'auth-aware',
  },
  {
    key: 'applications',
    label: 'My Applications',
    to: ROUTES.applications,
    idDesktop: 'nav-my-applications',
    idMobile: 'nav-my-applications',
    auth: 'auth-aware',
  },
  {
    key: 'tickets',
    label: 'Tickets',
    to: ROUTES.tickets,
    idDesktop: 'nav-tickets',
    idMobile: 'nav-tickets',
    auth: 'none',
  },
  {
    key: 'login',
    label: 'Login',
    to: ROUTES.login,
    idDesktop: 'nav-login',
    idMobile: 'nav-login',
    auth: 'none',
  },
] as const;

import { ROUTES } from '@/lib/routes';
import { loginNext } from '@/app/lib/authAware';

export type NavItem = { id: string; label: string; href: string; testId: string };

export const navLinks = (authed: boolean): NavItem[] => [
  {
    id: 'browse',
    label: 'Browse jobs',
    href: ROUTES.browseJobs,
    testId: 'nav-browse-jobs',
  },
  {
    id: 'tickets',
    label: 'Tickets',
    href: authed ? ROUTES.tickets : loginNext(ROUTES.tickets),
    testId: 'nav-tickets',
  },
  {
    id: 'post',
    label: 'Post a job',
    href: authed ? ROUTES.postJob : loginNext(ROUTES.postJob),
    testId: 'nav-post-job',
  },
  {
    id: 'apps',
    label: 'My Applications',
    href: authed ? ROUTES.applications : loginNext(ROUTES.applications),
    testId: 'nav-my-applications',
  },
  { id: 'login', label: 'Login', href: ROUTES.login, testId: 'nav-login' },
];

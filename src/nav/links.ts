export type NavItem = { id: string; label: string; href: string; testId: string };
export const navLinks = (authed: boolean): NavItem[] => [
  { id: 'browse', label: 'Browse jobs', href: '/browse-jobs', testId: 'nav-browse-jobs' },
  { id: 'tickets', label: 'Tickets', href: '/tickets', testId: 'nav-tickets' },
  {
    id: 'post',
    label: 'Post a job',
    href: authed ? '/post-jobs' : '/login?next=/post-jobs',
    testId: 'nav-post-job',
  },
  {
    id: 'apps',
    label: 'My Applications',
    href: authed ? '/applications' : '/login?next=/applications',
    testId: 'nav-my-applications',
  },
  { id: 'login', label: 'Login', href: '/login', testId: 'nav-login' },
];

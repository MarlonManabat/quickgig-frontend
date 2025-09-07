import { ROUTES } from '@/lib/routes';

export type CtaKey =
  | 'nav-browse-jobs'
  | 'hero-browse-jobs'
  | 'nav-post-job'
  | 'hero-post-job'
  | 'nav-my-applications';

export const CTA_TARGET: Record<CtaKey, string> = {
  'nav-browse-jobs': ROUTES.browseJobs,
  'hero-browse-jobs': ROUTES.browseJobs,
  'nav-post-job': ROUTES.postJob,
  'hero-post-job': ROUTES.postJob,
  'nav-my-applications': ROUTES.applications,
};

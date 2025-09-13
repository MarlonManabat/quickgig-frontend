import { test, expect } from '@playwright/test';

const HREFS: Record<string, string> = {
  'nav-browse-jobs-header': '/browse-jobs',
  'nav-post-job-header': '/login?next=/gigs/create',
  'nav-my-applications-header': '/login?next=/applications',
  'nav-tickets-header': '/login?next=/tickets',
  'nav-login-header': '/login?next=/browse-jobs',
  'hero-start': '/browse-jobs',
  'hero-post-job': '/login?next=/gigs/create',
  'hero-applications': '/login?next=/applications',
};

test('header/hero CTAs use canonical hrefs', async ({ page }) => {
  await page.goto('/');
  for (const [id, href] of Object.entries(HREFS)) {
    const a = page.getByTestId(id);
    await expect(a).toHaveAttribute('href', href);
  }
});

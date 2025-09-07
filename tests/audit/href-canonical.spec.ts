import { test, expect } from '@playwright/test';

const HREFS: Record<string, string> = {
  'nav-browse-jobs': '/browse-jobs',
  'hero-browse-jobs': '/browse-jobs',
  'nav-post-job': '/post-job',
  'hero-post-job': '/post-job',
  'nav-my-applications': '/applications',
};

test('header/hero CTAs use canonical hrefs', async ({ page }) => {
  await page.goto('/');
  for (const [id, href] of Object.entries(HREFS)) {
    const a = page.getByTestId(id);
    await expect(a).toHaveAttribute('href', href);
  }
});

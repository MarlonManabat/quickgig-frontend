import { test, expect } from '@playwright/test';
test('Landing hero CTAs route to app host', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-post-job')).toBeVisible();
  await expect(page.getByTestId('hero-browse-jobs')).toBeVisible();
  // Post a job
  await Promise.all([page.waitForNavigation(), page.getByTestId('hero-post-job').click()]);
  const p1 = new URL(page.url());
  expect(p1.host).toMatch(/(app\.quickgig\.ph|localhost:3000)/);
  expect(p1.pathname === '/gigs/create' || (p1.pathname === '/login' && p1.searchParams.get('next') === '/gigs/create')).toBeTruthy();
  // Browse jobs
  await page.goto('/');
  await Promise.all([page.waitForNavigation(), page.getByTestId('hero-browse-jobs').click()]);
  const p2 = new URL(page.url());
  expect(p2.host).toMatch(/(app\.quickgig\.ph|localhost:3000)/);
  expect(p2.pathname).toBe('/browse-jobs');
});

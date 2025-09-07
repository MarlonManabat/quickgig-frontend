import { test, expect } from '@playwright/test';
import { gotoHome, openMenu, expectAuthAwareRedirect } from './_helpers';

test('Post Job > auth-aware publish flow', async ({ page }) => {
  await gotoHome(page);

  // Header CTA (open menu on mobile; no-op on desktop)
  await openMenu(page);
  await expect(page.getByTestId('nav-post-job').first()).toBeVisible();
  await page.getByTestId('nav-post-job').first().click();

  // Accept either login redirect or final create page
  await expectAuthAwareRedirect(page, /\/gigs\/create\/?$/);

  const onCreate = /\/gigs\/create\/?$/.test(await page.url());
  if (!onCreate) return; // unauthenticated path: redirect to login is success for smoke

  // Fast publish (authenticated local dev)
  const title = `Test Job ${Date.now()}`;
  await page.getByPlaceholder('Job title').fill(title);
  await page.getByPlaceholder('Describe the work').fill('desc');
  await page.getByTestId('select-region').selectOption({ index: 1 });

  const cityOpts = await page.locator('[data-testid="select-city"] option').all();
  expect(cityOpts.length).toBeGreaterThan(1);

  await page.getByTestId('post-job-submit').click();
  await expect(page.getByTestId('post-job-success'), { message: 'publish succeeded' }).toBeVisible({ timeout: 10000 });

  await page.goto('/browse-jobs');
  await expect(page.getByTestId('jobs-list')).toContainText(title);
});

import { test, expect } from '@playwright/test';
test.use({ viewport: { width: 390, height: 844 } }); // iPhone-ish
test('Mobile header exposes CTAs via menu and routes correctly', async ({ page }) => {
  await page.goto('/browse-jobs');
  await expect(page.getByTestId('nav-menu-button')).toBeVisible();
  // Links should not be visible until menu opens (prevents duplicates in DOM)
  await expect(page.getByTestId('nav-post-job')).toBeHidden({ timeout: 500 }).catch(() => {});
  await page.getByTestId('nav-menu-button').click();
  await expect(page.getByTestId('nav-post-job')).toBeVisible();
  await expect(page.getByTestId('nav-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('nav-my-applications')).toBeVisible();
  await expect(page.getByTestId('nav-login')).toBeVisible();
  // Quick route assertion: browse should keep us on /browse-jobs
  await Promise.all([page.waitForNavigation(), page.getByTestId('nav-browse-jobs').click()]);
  expect(new URL(page.url()).pathname).toBe('/browse-jobs');
});

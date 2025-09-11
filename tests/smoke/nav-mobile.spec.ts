import { test, expect } from '@playwright/test';
import { mobileViewport, openMobileMenu } from './_helpers';

test.use(mobileViewport);

test('mobile header menu exposes core CTAs', async ({ page }) => {
  await page.goto('/');
  const menu = await openMobileMenu(page);
  for (const id of ['nav-browse-jobs', 'nav-post-job', 'nav-my-applications']) {
    await expect(menu.getByTestId(id)).toBeVisible();
  }
});

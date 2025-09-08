import { test, expect } from '@playwright/test';
import { mobileViewport, openMobileMenu } from './_helpers';

test.use(mobileViewport);

test('mobile header menu exposes core CTAs', async ({ page }) => {
  await page.goto('/');
  const menu = await openMobileMenu(page);
  for (const id of ['nav-browse-jobs', 'nav-login', 'nav-my-applications', 'nav-post-job']) {
    await expect(menu.locator(`[data-cta="${id}"]`).first()).toBeVisible();
  }
});

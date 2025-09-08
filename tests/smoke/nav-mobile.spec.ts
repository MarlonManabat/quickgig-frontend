import { test, expect } from '@playwright/test';
import { mobileViewport, openMobileMenu } from './_helpers';

test.use(mobileViewport);

test('mobile header menu exposes core CTAs', async ({ page }) => {
  await page.goto('/');
  const menu = await openMobileMenu(page);
  const ids = ['nav-browse-jobs', 'nav-login', 'nav-my-applications', 'nav-post-job'];
  for (const id of ids) {
    await expect(menu.getByTestId(id)).toBeVisible();
  }
});

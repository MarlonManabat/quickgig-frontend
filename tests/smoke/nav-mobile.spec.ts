import { test, expect } from '@playwright/test';
import { mobileViewport, openMobileMenu } from './_helpers';

test.use(mobileViewport);

test('mobile header menu exposes core CTAs', async ({ page }) => {
  await page.goto('/');
  await openMobileMenu(page);
  const menu = page.getByTestId('nav-menu');
  await expect(menu.getByTestId('nav-browse-jobs')).toBeVisible();
  await expect(menu.getByTestId('nav-login')).toBeVisible();
  await expect(menu.getByTestId('nav-my-applications')).toBeVisible();
  await expect(menu.getByTestId('nav-post-job')).toBeVisible();
});

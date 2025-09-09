import { test, expect } from '@playwright/test';
import { openMobileMenu, expectAuthAwareHref } from './_helpers';

test('mobile header menu exposes core CTAs', async ({ page }) => {
  await page.goto('/');
  const menu = await openMobileMenu(page);
  const ids = ['nav-browse-jobs','nav-tickets','nav-post-job','nav-my-applications','nav-login'];
  for (const id of ids) {
    const loc = menu.locator(`[data-cta="${id}"]`).first();
    await expect(loc).toBeVisible();
  }
  await expect(menu.locator('[data-cta="nav-browse-jobs"]')).toHaveAttribute('href', '/browse-jobs');
  await expectAuthAwareHref(menu.locator('[data-cta="nav-tickets"]'), '/tickets');
  await expectAuthAwareHref(menu.locator('[data-cta="nav-post-job"]'), '/post-jobs');
  await expectAuthAwareHref(menu.locator('[data-cta="nav-my-applications"]'), '/applications');
  await expect(menu.locator('[data-cta="nav-login"]')).toHaveAttribute('href', '/login');
});

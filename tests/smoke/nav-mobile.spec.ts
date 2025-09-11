import { test, expect } from '@playwright/test';
import { openMobileMenu, expectHref, reAuthAware } from './_helpers';

test('mobile header menu exposes core CTAs', async ({ page }) => {
  await page.goto('/');
  const menu = await openMobileMenu(page);
  const ids = ['nav-browse-jobs','nav-tickets','nav-post-job','nav-my-applications','nav-login'];
  for (const id of ids) {
    const loc = menu.getByTestId(id).first();
    await expect(loc).toBeVisible();
  }
  await expectHref(menu.getByTestId('nav-browse-jobs').first(), reAuthAware('/browse-jobs'));
  await expectHref(menu.getByTestId('nav-tickets').first(), reAuthAware('/tickets'));
  await expectHref(menu.getByTestId('nav-post-job').first(), reAuthAware('/post-jobs'));
  await expectHref(menu.getByTestId('nav-my-applications').first(), reAuthAware('/applications'));
  await expectHref(menu.getByTestId('nav-login').first(), /\/login(?:$|[?#])/);
});

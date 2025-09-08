import { test } from '@playwright/test';
import { expectAuthAwareRedirect, expectLoginOrPkce, clickIfSameOriginOrAssertHref } from './_helpers';

test.describe('desktop header CTAs', () => {
  test('Login', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByTestId('nav-login').first();
    const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/login$/);
    if (navigated) await expectLoginOrPkce(page);
  });

  test('My Applications (auth-aware)', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByTestId('nav-my-applications').first();
    const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/applications$/);
    if (navigated) await expectAuthAwareRedirect(page, /\/applications$/);
  });

  test('Post a Job (auth-aware)', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByTestId('nav-post-job').first();
    const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/post-job$/);
    if (navigated) await expectAuthAwareRedirect(page, /\/post-job$/);
  });
});

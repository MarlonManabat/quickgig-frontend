import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, expectLoginOrPkce, clickIfSameOriginOrAssertHref } from './_helpers';

test.use({ viewport: { width: 360, height: 740 } });

async function openMenu(page) {
  await page.getByTestId('nav-menu-button').click();
  await expect(page.getByTestId('nav-menu')).toBeVisible();
}

test.describe('mobile header CTAs', () => {
  test('Browse Jobs', async ({ page }) => {
    await page.goto('/');
    await openMenu(page);
    await page.getByTestId('navm-browse-jobs').click();
    await expect(page).toHaveURL(/\/browse-jobs\/?/);
  });

  test('Post a Job (auth-aware)', async ({ page }) => {
    await page.goto('/');
    await openMenu(page);
    const cta = page.getByTestId('navm-post-job');
    const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/post-job$/);
    if (navigated) await expectAuthAwareRedirect(page, /\/post-job$/);
  });

  test('My Applications (auth-aware)', async ({ page }) => {
    await page.goto('/');
    await openMenu(page);
    const cta = page.getByTestId('navm-my-applications');
    const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/applications$/);
    if (navigated) await expectAuthAwareRedirect(page, /\/applications$/);
  });

  test('Login', async ({ page }) => {
    await page.goto('/');
    await openMenu(page);
    const cta = page.getByTestId('navm-login');
    const navigated = await clickIfSameOriginOrAssertHref(page, cta, /\/login$/);
    if (navigated) await expectLoginOrPkce(page);
  });
});

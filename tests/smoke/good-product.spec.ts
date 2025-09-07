import { test, expect } from '@playwright/test';
import { gotoHome, openMenu, expectAuthAwareRedirect } from './_helpers';

test.describe('good product smoke', () => {
  test('mobile › good product smoke', async ({ page }) => {
    await gotoHome(page);
    await openMenu(page);

    // Public browse jobs should navigate directly
    await page.getByTestId('nav-browse-jobs').first().click();
    await expect(page).toHaveURL(/\/browse-jobs\/?$/);
  });

  test('desktop › good product smoke', async ({ page }) => {
    await gotoHome(page);

    // My Applications is auth-aware
    await page.getByTestId('nav-my-applications').first().click();
    await expectAuthAwareRedirect(page, '/applications');
  });

  test('sitemap + robots', async ({ page }) => {
    const sm = await page.request.get('/sitemap.xml');
    expect(sm.ok()).toBeTruthy();
    const text = await sm.text();
    expect(text).toContain('/browse-jobs'); // relaxed check, just presence

    const robots = await page.request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
  });

  test('Landing hero CTAs route to app host', async ({ page }) => {
    await gotoHome(page);
    await expect(page.getByTestId('hero-browse-jobs').first()).toBeVisible();
    await page.getByTestId('hero-browse-jobs').first().click();
    await expect(page).toHaveURL(/\/browse-jobs\/?$/);
  });

  test('desktop header CTAs › Post a Job (auth-aware)', async ({ page }) => {
    await gotoHome(page);
    await page.getByTestId('nav-post-job').first().click();
    await expectAuthAwareRedirect(page, /\/(gigs\/create|login\?next=%2Fgigs%2Fcreate)$/);
  });
});

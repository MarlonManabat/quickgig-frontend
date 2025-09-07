import { test, expect } from '@playwright/test';
import { openMenu, expectAuthAwareRedirect } from './_helpers';

test.describe('good product smoke', () => {
  test('sitemap + robots', async ({ page }) => {
    const sm = await page.request.get('/sitemap.xml');
    expect(sm.ok()).toBeTruthy();
    const text = await sm.text();
    expect(text).toMatch(/\/browse-jobs|https:\/\/(app\.)?quickgig\.ph\//);
    const robots = await page.request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
  });

  test('mobile > hero CTAs route to app host', async ({ page }) => {
    await page.goto('/');
    await openMenu(page);
    const link = page.getByTestId('hero-browse-jobs').first();
    await expect(link).toBeVisible();
    await link.click();
    await expectAuthAwareRedirect(page, /\/browse-jobs\/?$/);
  });
});

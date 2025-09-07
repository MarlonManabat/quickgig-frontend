import { test, expect } from '@playwright/test';
import { gotoHome, openMenu, expectAuthAwareRedirect } from './_helpers';

test.describe('good product smoke', () => {
  test('desktop > good product smoke', async ({ page }) => {
    await gotoHome(page);
    await expect(page.getByTestId('nav-browse-jobs').first()).toBeVisible();
    await page.getByTestId('nav-browse-jobs').first().click();
    await expect(page).toHaveURL(/\/browse-jobs\/?$/);
  });

  test('mobile > good product smoke', async ({ page }) => {
    await gotoHome(page);
    await openMenu(page); // ensure mobile links are visible
    await expect(page.getByTestId('nav-browse-jobs').first()).toBeVisible();
    await page.getByTestId('nav-browse-jobs').first().click();
    await expect(page).toHaveURL(/\/browse-jobs\/?$/);
  });

  test('sitemap + robots', async ({ page }) => {
    const sm = await page.request.get('/sitemap.xml');
    expect(sm.ok()).toBeTruthy();
    const text = await sm.text();
    // allow explicit /browse-jobs or root host entries on either host
    expect(text).toMatch(/\/browse-jobs|https:\/\/(app\.)?quickgig\.ph\//);

    const robots = await page.request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
  });
});

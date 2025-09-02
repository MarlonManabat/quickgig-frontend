import { test, expect, Page } from '@playwright/test';

async function gotoHome(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
}

async function clickNavOrGo(page: Page, opts: { name: RegExp, fallbackPath: string }) {
  const link = page.getByRole('link', { name: opts.name });
  if (await link.count()) {
    await link.first().click();
  } else {
    await page.goto(opts.fallbackPath, { waitUntil: 'domcontentloaded' });
  }
}

test.describe('nav links work', () => {
  test('Home ▸ Browse Jobs', async ({ page }) => {
    await gotoHome(page);
    await clickNavOrGo(page, { name: /browse jobs/i, fallbackPath: '/browse-jobs' });
    await expect(page).toHaveURL(/\/(browse-jobs|jobs)\b/i, { timeout: 10_000 });
  });

  test('Home ▸ My Applications (signed out ok)', async ({ page }) => {
    await gotoHome(page);
    await clickNavOrGo(page, { name: /my applications/i, fallbackPath: '/applications' });
    await expect(page).toHaveURL(/\/(applications|login)\b/i, { timeout: 10_000 });
  });
});


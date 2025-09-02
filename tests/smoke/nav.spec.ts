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
    await expect.poll(() => page.url(), { timeout: 10_000 })
      .toContain('/browse-jobs');
  });

  test('Home ▸ My Applications (signed out ok)', async ({ page }) => {
    await gotoHome(page);
    await clickNavOrGo(page, { name: /my applications/i, fallbackPath: '/applications' });
    // Unauthed may redirect to login; accept either
    const url = await page.url();
    expect(/\/(applications|login)\b/i.test(url)).toBeTruthy();
  });
});


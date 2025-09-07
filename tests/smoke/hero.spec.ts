import { test, expect } from '@playwright/test';
import { gotoHome } from './_helpers';

test('Landing hero CTAs route to app host', async ({ page }) => {
  await gotoHome(page);

  const url = new URL(await page.url());
  if (/\/$/.test(url.pathname)) {
    const browse = page.getByTestId('hero-browse-jobs').first();
    await expect(browse).toBeVisible();
    await browse.click();
  }

  await expect(page).toHaveURL(/\/browse-jobs\/?$/);
  await expect(page.getByTestId('jobs-list').first()).toBeVisible();
});

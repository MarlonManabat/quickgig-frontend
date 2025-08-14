// @ts-nocheck
import { test, expect } from '@playwright/test';

async function openLink(page, name: RegExp) {
  const link = page.getByRole('link', { name }).first();
  if (await link.isVisible()) {
    await link.click();
  } else {
    await page.goto(`https://app.quickgig.ph/${name.source.toLowerCase().replace(/[^a-z]/g,'')}`);
  }
}

test('login and signup entrypoints render', async ({ page }) => {
  await page.goto('https://app.quickgig.ph');
  await openLink(page, /Login|Log in/i);
  await expect(page.locator('form')).toBeVisible();
  await page.goto('https://app.quickgig.ph');
  await openLink(page, /Sign Up|Register/i);
  await expect(page.locator('form')).toBeVisible();
});

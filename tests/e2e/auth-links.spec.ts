import { test, expect } from '@playwright/test';

const BASE_HOST = new URL(process.env.BASE || 'https://app.quickgig.ph').host;
function assertAppUrl(url: string) {
  expect(new URL(url).host).toBe(BASE_HOST);
}

test('login and signup forms render for anonymous users', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /login/i }).click();
  assertAppUrl(page.url());
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await page.goBack();
  assertAppUrl(page.url());

  await page.getByRole('link', { name: /sign up/i }).click();
  assertAppUrl(page.url());
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await page.goBack();
  assertAppUrl(page.url());
});

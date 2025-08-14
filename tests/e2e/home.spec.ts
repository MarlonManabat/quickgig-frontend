import { test, expect } from '@playwright/test';

const BASE_HOST = new URL(process.env.BASE || 'https://app.quickgig.ph').host;

function assertAppUrl(url: string) {
  expect(new URL(url).host).toBe(BASE_HOST);
}

test('home page renders header and nav', async ({ page }) => {
  await page.goto('/');
  assertAppUrl(page.url());
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
});

test('Simulan Na CTA routes to onboarding or jobs @smoke', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /simulan na/i }).click();
  assertAppUrl(page.url());
  await expect(page).toHaveURL(new RegExp('/(find-work|onboarding)'));
});

test('Browse Jobs CTA shows search @smoke', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /browse jobs/i }).click();
  assertAppUrl(page.url());
  await expect(page).toHaveURL(/\/find-work/);
  await expect(page.getByRole('main')).toBeVisible();
});

test('navigation links render pages', async ({ page }) => {
  const links = [
    { name: /home/i, path: '/' },
    { name: /find work/i, path: '/find-work' },
    { name: /post job/i, path: '/post-job' },
  ];
  for (const link of links) {
    await page.goto('/');
    await page.getByRole('link', { name: link.name }).click();
    assertAppUrl(page.url());
    await expect(page).toHaveURL(new RegExp(`${link.path}$`));
  }
});

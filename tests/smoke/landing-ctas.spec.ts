import { test, expect } from '@playwright/test';

const APP_BASE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'https://app.quickgig.ph';

test('landing CTAs point to app domain', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Find work' })).toHaveAttribute('href', `${APP_BASE}/find`);
  await expect(page.getByRole('link', { name: 'Post job' })).toHaveAttribute('href', `${APP_BASE}/post`);
  await expect(page.getByRole('link', { name: 'Login' })).toHaveAttribute('href', `${APP_BASE}/login`);
  await expect(page.getByRole('link', { name: 'Simulan na' })).toHaveAttribute('href', `${APP_BASE}/`);
  await expect(page.getByRole('link', { name: 'Browse jobs' })).toHaveAttribute('href', `${APP_BASE}/find`);
});

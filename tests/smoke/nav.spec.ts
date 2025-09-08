import { test } from '@playwright/test';
import { expectAuthAwareRedirect, loginRe } from './_helpers';

test('desktop header CTAs › Login', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /login/i }).click();
  await expectAuthAwareRedirect(page, loginRe);
});

test('desktop header CTAs › My Applications (auth-aware)', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /my applications/i }).click();
  await expectAuthAwareRedirect(page, /\/applications$/);
});

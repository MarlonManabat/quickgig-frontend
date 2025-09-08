import { test } from '@playwright/test';
import { expectAuthAwareRedirect, stubAuthPkce } from './_helpers';

test('desktop header CTAs › Login', async ({ page }) => {
  await page.goto('/');
  await stubAuthPkce(page);
  await page.getByRole('link', { name: /login/i }).click();
  await expectAuthAwareRedirect(page, /\/login(\/.*)?$/);
});

test('desktop header CTAs › My Applications (auth-aware)', async ({ page }) => {
  await page.goto('/');
  await stubAuthPkce(page);
  await page.getByRole('link', { name: /my applications/i }).click();
  await expectAuthAwareRedirect(page, /\/login(\/.*)?$/);
});

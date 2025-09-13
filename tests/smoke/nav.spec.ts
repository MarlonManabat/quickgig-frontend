import { test, expect } from '@playwright/test';
import { openMobileMenu, visByTestId, expectAuthAwareRedirect } from './_helpers';

test('desktop header CTAs › Login', async ({ page }) => {
  await page.goto('/');
  await visByTestId(page, 'nav-login').click();
  await expectAuthAwareRedirect(page, /\/login\/?$/);
});

test('desktop header CTAs › My Applications (auth-aware)', async ({ page }) => {
  await page.goto('/');
  await openMobileMenu(page);
  await visByTestId(page, 'nav-my-applications').click();
  await expectAuthAwareRedirect(page, /\/applications\/?$/);
});

import { test, expect } from '@playwright/test';
import { expectAuthAwareRedirect, loginRe } from './_helpers';

test('desktop header CTAs › Login', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('nav-login').first().click();
  await expectAuthAwareRedirect(page, loginRe);
});

test('desktop header CTAs › My Applications (auth-aware)', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('nav-my-applications').first().click();
  await expectAuthAwareRedirect(page, /\/login(\?.*)?$|\/applications$/);
});

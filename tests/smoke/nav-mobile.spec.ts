import { test, expect } from '@playwright/test';
import { openMobileMenu, expectAuthAwareRedirect, loginRe, expectToBeOnRoute, visByTestId, loginOr } from './_helpers';

test('mobile header CTAs › Login', async ({ page }) => {
  await page.goto('/browse-jobs');
  await openMobileMenu(page);
  await (await visByTestId(page, 'nav-login-menu')).click();
  await expectAuthAwareRedirect(page, loginRe);
});

test('mobile header CTAs › Browse Jobs', async ({ page }) => {
  await page.goto('/browse-jobs');
  await openMobileMenu(page);
  await (await visByTestId(page, 'nav-browse-jobs-menu')).click();
  await expectToBeOnRoute(page, '/browse-jobs');
});

test('mobile header CTAs › My Applications (auth-aware)', async ({ page }) => {
  await page.goto('/browse-jobs');
  await openMobileMenu(page);
  await (await visByTestId(page, 'nav-my-applications-menu')).click();
  await expectAuthAwareRedirect(page, loginOr(/\/applications\/?$/));
});

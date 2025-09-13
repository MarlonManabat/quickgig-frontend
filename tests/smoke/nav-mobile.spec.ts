import { test, expect } from '@playwright/test';
import { openMobileMenu, expectAuthAwareRedirect, loginRe } from './_helpers';

test('mobile header CTAs › Login', async ({ page }) => {
  await page.goto('/');
  await openMobileMenu(page);
  // fall back to role name if testId differs in some layouts
  const login =
    (await page.getByTestId('nav-login').count())
      ? page.getByTestId('nav-login').locator(':visible').first()
      : page.getByRole('link', { name: /login/i }).first();
  await login.click();
  await expectAuthAwareRedirect(page, loginRe);
});

test('mobile header CTAs › Browse Jobs', async ({ page }) => {
  await page.goto('/');
  await openMobileMenu(page);
  const browse =
    (await page.getByTestId('nav-browse-jobs').count())
      ? page.getByTestId('nav-browse-jobs').locator(':visible').first()
      : page.getByRole('link', { name: /browse jobs/i }).first();
  await browse.click();
  await expect(page).toHaveURL(/\/browse-jobs/);
});

test('mobile header CTAs › My Applications (auth-aware)', async ({ page }) => {
  await page.goto('/');
  await openMobileMenu(page);
  await page.getByTestId('nav-my-applications').locator(':visible').first().click();
  await expectAuthAwareRedirect(page, /\/login(\?.*)?$|\/applications$/);
});

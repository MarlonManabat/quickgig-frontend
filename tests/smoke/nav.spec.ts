import { test, expect } from '@playwright/test';
import { expectHref } from './_helpers';

// We assert hrefs instead of navigating to avoid page crashes when APP_HOST or PKCE routes are unreachable.
test('desktop header CTAs › Login › Expect \'poll toMatch\'', async ({ page }) => {
  await page.goto('/');
  const login = page.getByTestId('nav-login').first();
  await expect(login).toBeVisible();
  await expectHref(login, /(\/api\/auth\/pkce\/start(\?.*)?$)|(^\/login(\/.*)?$)/);
});

// We assert hrefs instead of navigating to avoid page crashes when APP_HOST or PKCE routes are unreachable.
test('desktop header CTAs › My Applications (auth-aware) › Expect \'poll toMatch\'', async ({ page }) => {
  await page.goto('/');
  const apps = page.getByTestId('nav-my-applications').first();
  await expect(apps).toBeVisible();
  await expectHref(
    apps,
    /(\/applications$)|(\/login(\/.*)?$)|(\/api\/auth\/pkce\/start\?[^#]*dest=%2Fapplications)/
  );
});

import { test, expect } from '@playwright/test';
import { expectHref } from './_helpers';

test('desktop header CTAs › Login', async ({ page }) => {
  await page.goto('/');
  await expectHref(page.getByTestId('nav-login'), /\/login$/);
});

test('desktop header CTAs › My Applications (auth-aware)', async ({ page }) => {
  await page.goto('/');
  await expectHref(page.getByTestId('nav-my-applications'), /(\/applications$|\/login\?next=\/applications$)/);
});

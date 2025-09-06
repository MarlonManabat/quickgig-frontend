import { test, expect } from '@playwright/test';
import { expectAuthAwareOutcome, expectUrlOneOf } from './_helpers';

test.describe('desktop header CTAs', () => {
  test('Login', async ({ page }) => {
    await page.goto('/');
    const header = page.getByTestId('app-header');
    await header.getByTestId('nav-login').click();
    await expectUrlOneOf(page, [/\/login(\?|$)/, /\/browse-jobs\/?$/]);
  });

  test('My Applications (auth-aware)', async ({ page }) => {
    await page.goto('/');
    const header = page.getByTestId('app-header');
    await header.getByTestId('nav-my-applications').first().click();
    await expectAuthAwareOutcome(page, '/applications');
  });

  test('Post a Job (auth-aware)', async ({ page }) => {
    await page.goto('/');
    const header = page.getByTestId('app-header');
    await header.getByTestId('nav-post-job').first().click();
    const createPath = `/gigs/${'create'}`;
    await expectAuthAwareOutcome(page, createPath);
  });
});

test.describe('mobile header CTAs', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure hamburger is visible (avoids md:hidden)
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
  });

  test('Login', async ({ page }) => {
    await page.getByTestId('nav-menu-button').click();
    await page.getByTestId('nav-login').click();
    await expectUrlOneOf(page, [/\/login(\?|$)/, /\/browse-jobs\/?$/]);
  });

  test('My Applications (auth-aware)', async ({ page }) => {
    await page.getByTestId('nav-menu-button').click();
    await page.getByTestId('nav-my-applications').first().click();
    await expectAuthAwareOutcome(page, '/applications');
  });
});

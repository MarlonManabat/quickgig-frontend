import { test, expect } from '@playwright/test';
import { APP_ORIGIN, appHref } from '../../tests/helpers/origins';

test.describe('Landing CTAs route to app host', () => {
  test('header links point to app host', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('header a:has-text("Find Work")'))
      .toHaveAttribute('href', new RegExp(`^${APP_ORIGIN.replace(/\//g, '\\/')}\/find$`));

    await expect(page.locator('header a:has-text("Post Job")'))
      .toHaveAttribute('href', new RegExp(`^${APP_ORIGIN.replace(/\//g, '\\/')}\/post$`));

    await expect(page.locator('header a:has-text("Login")'))
      .toHaveAttribute('href', new RegExp(`^${APP_ORIGIN.replace(/\//g, '\\/')}\/login$`));
  });

  test('hero buttons go to app root and /find', async ({ page }) => {
    await page.goto('/');

    const simulanNa = page.getByRole('link', { name: /simulan na/i });
    const browseJobs = page.getByRole('link', { name: /browse jobs/i });

    await expect(simulanNa).toHaveAttribute('href', appHref('/'));
    await expect(browseJobs).toHaveAttribute('href', appHref('/find'));
  });
});

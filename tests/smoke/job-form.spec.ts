import { test, expect } from '@playwright/test';
import { testLogin } from '../helpers/testLogin';

const supa = process.env.NEXT_PUBLIC_SUPABASE_URL!;

test('job form cascades render', async ({ page }) => {
  await page.route(`${supa}/rest/v1/user_credits*`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ credits: 1 }),
    });
  });
  await testLogin(page, 'employer');
  await page.goto('/jobs/new');
  await expect(page.getByTestId('sel-region')).toBeVisible();
  await expect(page.getByTestId('sel-province')).toBeVisible();
  await expect(page.getByTestId('sel-city')).toBeVisible();
});

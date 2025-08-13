// @ts-nocheck
import { test, expect } from '@playwright/test';

test('shows UP when API returns ok', async ({ page }) => {
  await page.route('https://api.quickgig.ph/health', route => {
    route.fulfill({ json: { status: 'ok' } });
  });
  await page.goto('/health-check');
  await expect(page.getByText('UP')).toBeVisible();
});

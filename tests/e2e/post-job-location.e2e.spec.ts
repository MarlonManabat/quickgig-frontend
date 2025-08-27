import { test, expect } from '@playwright/test';
import { loginAs } from './_helpers/session';

test.describe('post job location', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'employer');
  });

  test('loads geo selects and toggles online job', async ({ page }) => {
    await page.goto('/post');
    const region = page.getByTestId('region-select');
    await expect(region.locator('option')).toHaveCount(4, { timeout: 5000 });
    await region.selectOption('NCR');
    const province = page.getByTestId('province-select');
    await expect(province.locator('option')).toHaveCount(2, { timeout: 5000 });
    await province.selectOption('MM');
    const city = page.getByTestId('city-select');
    await expect(city.locator('option')).toHaveCount(2, { timeout: 5000 });
    await city.selectOption('MNL');
    const online = page.getByLabel('Online Job');
    await online.check();
    await expect(region).toBeDisabled();
    await expect(province).toBeDisabled();
    await expect(city).toBeDisabled();
    await online.uncheck();
    await expect(region).toHaveValue('NCR');
    await expect(province).toHaveValue('MM');
    await expect(city).toHaveValue('MNL');
  });
});

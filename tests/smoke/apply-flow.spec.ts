import { test, expect } from '@playwright/test';
import { gotoHome, expectVisibleOrAuthRedirect } from './_helpers';

test.describe('apply flow', () => {
  test('desktop › apply flow', async ({ page }) => {
    await gotoHome(page);
    await page.goto('/browse-jobs');
    const first = page.getByTestId('job-card').first();
    await first.click();

    // Try the first apply button; if we’re not authenticated, we accept login redirect.
    const result = await expectVisibleOrAuthRedirect(
      page,
      page.getByTestId('apply-button').first(),
      '/applications'
    );
    if (result === 'redirect') return;

    // Authenticated path (local dev). Continue the flow quickly with shallow checks.
    await page.getByPlaceholder('Job title').fill(`Test Job ${Date.now()}`);
    await page.getByPlaceholder('Describe the work').fill('desc');
    await page.getByTestId('select-region').selectOption({ index: 1 });
    const options = await page.locator('[data-testid="select-city"] option').all();
    expect(options.length).toBeGreaterThan(1);
    await page.getByTestId('select-city').selectOption({ index: 1 });
  });

  test('mobile › apply flow', async ({ page, browserName }) => {
    await gotoHome(page);
    await page.goto('/browse-jobs');
    const first = page.getByTestId('job-card').first();
    await first.click();
    const result = await expectVisibleOrAuthRedirect(
      page,
      page.getByTestId('apply-button').first(),
      '/applications'
    );
    if (result === 'redirect') return;

    await page.getByPlaceholder('Job title').fill(`Test Job ${Date.now()}`);
    await page.getByPlaceholder('Describe the work').fill('desc');
    await page.getByTestId('select-region').selectOption({ index: 1 });
    const options = await page.locator('[data-testid="select-city"] option').all();
    expect(options.length).toBeGreaterThan(1);
    await page.getByTestId('select-city').selectOption({ index: 1 });
  });
});

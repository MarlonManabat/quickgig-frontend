import { test, expect } from '@playwright/test';
import { discoverRoutes, recordVisit, writeCoverage } from './routes';
import { waitForAppReady, noConsoleErrors } from './helpers/waits';

test('basic render of routes', async ({ page }) => {
  const list = await discoverRoutes(page);
  for (const route of list) {
    const stop = await noConsoleErrors(page);
    await page.goto(route);
    await waitForAppReady(page);
    await expect(page.locator('[data-testid="app-header"], main')).toBeVisible();
    stop();
    recordVisit(route);
  }
});

test.afterAll(() => {
  writeCoverage();
});

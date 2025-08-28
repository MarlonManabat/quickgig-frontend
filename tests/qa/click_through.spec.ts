import { test } from '@playwright/test';
import { discoverRoutes, recordVisit, writeCoverage } from './routes';
import { waitForAppReady } from './helpers/waits';
import { clickAllInteractivesOn } from './helpers/dom';

test('click through pages', async ({ page }) => {
  const list = await discoverRoutes(page);
  for (const route of list) {
    await page.goto(route);
    await waitForAppReady(page);
    await clickAllInteractivesOn(page);
    recordVisit(route);
  }
});

test.afterAll(() => {
  writeCoverage();
});

import { test, expect } from '@playwright/test';
import { gotoHome, expectToBeOnRoute } from '../e2e/_helpers';
import { expectAuthAwareRedirect } from './_helpers';

test('Landing hero CTAs route to app host', async ({ page }) => {
  await gotoHome(page);
  await expect(page.getByTestId('hero-start')).toBeVisible();

  await page.getByTestId('hero-start').click();
  await expectToBeOnRoute(page, /\/browse-jobs\/?$/);
});

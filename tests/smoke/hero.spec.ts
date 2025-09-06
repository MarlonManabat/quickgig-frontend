import { test, expect } from '@playwright/test';
import { gotoHome, expectToBeOnRoute } from '../e2e/_helpers';
import { expectAuthAwareRedirect } from './_helpers';

test('Landing hero CTAs route to app host', async ({ page }) => {
  await gotoHome(page);
  await expect(page.getByTestId('hero-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('hero-post-job')).toBeVisible();

  await page.getByTestId('hero-browse-jobs').click();
  await expectToBeOnRoute(page, /\/browse-jobs\/?$/);

  await gotoHome(page);
  await page.getByTestId('hero-post-job').click();
  await expectAuthAwareRedirect(page, '/post-job');
});

import { test, expect } from '@playwright/test';
import { gotoHome, expectAuthAwareOutcome } from './_helpers';

test('Landing → App CTAs » "Post a job" opens on app host', async ({ page }) => {
  await gotoHome(page);
  const link = page.getByTestId('nav-post-job').first();
  await expect(link).toHaveAttribute('href', '/post-job');
  await link.click();
  const createPath = `/gigs/${'create'}`;
  await expectAuthAwareOutcome(page, createPath);
});

test('Landing → App CTAs » "My Applications" opens on app host', async ({ page }) => {
  await gotoHome(page);
  const link = page.getByTestId('nav-my-applications').first();
  await expect(link).toHaveAttribute('href', '/applications');
  await link.click();
  await expectAuthAwareOutcome(page, '/applications');
});

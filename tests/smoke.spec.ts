import { expect, test } from '@playwright/test';

import { expectAuthAwareRedirect } from './helpers';

test('Browse → job detail → apply enforces auth-aware redirect', async ({ page }) => {
  await page.goto('/');
  await page.waitForURL('**/browse-jobs');

  const jobsList = page.getByTestId('jobs-list');
  await expect(jobsList).toBeVisible();

  const firstCard = page.getByTestId('job-card').first();
  await expect(firstCard).toBeVisible();
  await firstCard.click();

  await expect(page.getByTestId('apply-button')).toBeVisible();
  await page.getByTestId('apply-button').click();
  await expectAuthAwareRedirect(page, /\/jobs\//);
});

test('Applications page redirects when unauthenticated', async ({ page }) => {
  await page.goto('/applications');
  await expectAuthAwareRedirect(page, /\/applications$/);
});

test('Post job route redirects unauthenticated users', async ({ page }) => {
  await page.goto('/gigs/create');
  await expectAuthAwareRedirect(page, /\/gigs\/create$/);
});

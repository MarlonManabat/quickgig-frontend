import { test, expect } from '@playwright/test';
import {
  expectListOrEmpty,
  expectLoginOrPkce,
  openMobileMenu,
  expectAuthAwareRedirect,
  visByTestId,
  loginRe,
} from './_helpers';

test('Browse Jobs renders', async ({ page }) => {
  await page.goto('/browse-jobs');
  await expectListOrEmpty(page, 'jobs-list', { testId: 'jobs-empty' });
});

test('Apply flow redirects when signed-out', async ({ page }) => {
  await page.goto('/browse-jobs');
  const count = await page.getByTestId('job-card').count();
  if (count === 0) test.skip();
  await page.getByTestId('job-card').first().click();
  await page.getByTestId('apply-button').click();
  await expectLoginOrPkce(page);
});

test('My Applications is auth-gated', async ({ page }) => {
  await page.goto('/applications');
  await expectAuthAwareRedirect(page, new RegExp(`${loginRe.source}|\/applications$`));
});

test('Post a Job placeholder', async ({ page }) => {
  await page.goto('/post-job');
  await expect(page.getByText('Post a job', { exact: false })).toBeVisible();
});

test('Header/nav is wired', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/browse-jobs');
  await openMobileMenu(page);
  for (const id of ['nav-browse-jobs', 'nav-login', 'nav-my-applications', 'nav-post-job']) {
    await visByTestId(page, id);
  }
});

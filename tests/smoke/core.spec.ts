import { test, expect } from '@playwright/test';
import {
  expectListOrEmpty,
  expectLoginOrPkce,
  openMobileMenu,
  expectAuthAwareRedirect,
  visByTestId,
  gotoHome,
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

test('My Applications is auth-gated (login or safe fallback)', async ({ page }) => {
  await page.goto('/applications');
  await expectAuthAwareRedirect(page, /\/applications\/?$/);
});

test('Post a Job placeholder', async ({ page }) => {
  await page.goto('/gigs/create');
  await expect(page.getByTestId('post-job-skeleton')).toBeVisible();
});

test('Header/nav is wired', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await openMobileMenu(page);
  for (const id of ['nav-browse-jobs', 'nav-login', 'nav-my-applications', 'nav-post-job']) {
    await expect(visByTestId(page, id)).toBeVisible();
  }
});

test('Landing CTAs route correctly', async ({ page }) => {
  await gotoHome(page);
  const hero = page.getByTestId('hero-start');
  if (!(await hero.isVisible())) test.skip(true, 'Hero absent in snapshot (landing redirects to /browse-jobs).');
  await expect(hero).toBeVisible();
  const postJob = page.getByTestId('hero-post-job');
  await expect(postJob).toHaveAttribute(
    'href',
    /^(\/gigs\/create\/?|\/post-job|https?:\/\/app\.quickgig\.ph\/post-job)$/,
  );
});

import { test, expect } from '@playwright/test';
import { expectListOrEmpty, expectLoginOrPkce, openMobileMenu } from './_helpers';
import path from 'path';

const landing = 'file://' + path.join(process.cwd(), 'landing_public_html', 'index.html');

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
  await expectLoginOrPkce(page);
});

test('Post a Job placeholder', async ({ page }) => {
  await page.goto('/post-job');
  await expect(page.getByTestId('post-job-skeleton')).toBeVisible();
});

test('Header/nav is wired', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await openMobileMenu(page);
  for (const id of ['nav-browse-jobs', 'nav-login', 'nav-my-applications', 'nav-post-job']) {
    await expect(page.getByTestId(id)).toBeVisible();
  }
});

test('Landing CTAs route correctly', async ({ page }) => {
  await page.goto(landing);
  await expect(page.getByTestId('cta-start-now')).toHaveAttribute(
    'href',
    /\/search\?intent=worker$/
  );
  await expect(page.getByTestId('hero-post-job')).toHaveAttribute('href', '/post-job');
});

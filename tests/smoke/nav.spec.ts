import { test, expect } from '@playwright/test';
import { expectAuthAwareHref } from './_helpers';

test('desktop header CTAs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nav-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('nav-tickets')).toBeVisible();
  await expect(page.getByTestId('nav-post-job')).toBeVisible();
  await expect(page.getByTestId('nav-my-applications')).toBeVisible();
  await expect(page.getByTestId('nav-login')).toBeVisible();

  await expect(page.getByTestId('nav-browse-jobs')).toHaveAttribute('href', '/browse-jobs');
  await expectAuthAwareHref(page.getByTestId('nav-tickets'), '/tickets');
  await expectAuthAwareHref(page.getByTestId('nav-post-job'), '/post-jobs');
  await expectAuthAwareHref(page.getByTestId('nav-my-applications'), '/applications');
  await expect(page.getByTestId('nav-login')).toHaveAttribute('href', '/login');
});

import { test, expect } from '@playwright/test';
import { gotoHome } from '../e2e/_helpers';
import { expectAuthAwareRedirect } from './_helpers';

test('Landing → Browse → open job → Apply (auth-aware)', async ({ page }) => {
  await gotoHome(page);
  await page.getByTestId('nav-browse-jobs').click();
  await expect(page.getByTestId('job-card').first()).toBeVisible();
  await page.getByTestId('job-card').first().click();
  await expect(page.getByTestId('apply-button')).toBeVisible();

  await page.getByTestId('apply-button').click();
  await expectAuthAwareRedirect(page, /applications$/);

  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('DEV_AUTH', 'true'));
  await page.getByTestId('nav-browse-jobs').click();
  await page.getByTestId('job-card').first().click();
  await page.getByTestId('apply-button').click();
  await expect(page).toHaveURL(/\/applications$/);
  await expect(
    page.getByTestId('applications-list').getByTestId('application-row').first(),
  ).toBeVisible();
});

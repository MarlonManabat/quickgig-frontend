import { test, expect } from '@playwright/test';
import { expectHref, reAuthAware } from './_helpers';

test('desktop header CTAs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nav-browse-jobs')).toBeVisible();
  await expect(page.getByTestId('nav-tickets')).toBeVisible();
  await expect(page.getByTestId('nav-post-job')).toBeVisible();
  await expect(page.getByTestId('nav-my-applications')).toBeVisible();
  await expect(page.getByTestId('nav-login')).toBeVisible();

  await expectHref(page.getByTestId('nav-browse-jobs').first(), reAuthAware('/browse-jobs'));
  await expectHref(page.getByTestId('nav-tickets').first(), reAuthAware('/tickets'));
  await expectHref(page.getByTestId('nav-post-job').first(), reAuthAware('/post-jobs'));
  await expectHref(page.getByTestId('nav-my-applications').first(), reAuthAware('/applications'));
  await expectHref(page.getByTestId('nav-login').first(), /\/login(?:$|[?#])/);
});

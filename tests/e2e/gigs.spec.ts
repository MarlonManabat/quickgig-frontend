import { test, expect } from '@playwright/test';
import { stubSignIn, getDemoEmail } from '../utils/session';

const qa = process.env.QA_TEST_MODE === 'true';

test('@full admin can post gig and view listing', async ({ page }) => {
  const admin = getDemoEmail('admin');
  if (qa) await stubSignIn(page, admin);
  const title = `QA Gig ${Date.now()}`;
  await page.goto('/app/post');
  await page.waitForLoadState('domcontentloaded');

  await page.getByTestId('post-title').fill(title);
  await page.getByTestId('post-description').fill('End-to-end tested gig.');
  await page.getByTestId('publish-gig').click();

  await page.waitForURL('**/gigs/**', { timeout: 20_000 });
  await expect(page.getByText(title)).toBeVisible({ timeout: 20_000 });
});

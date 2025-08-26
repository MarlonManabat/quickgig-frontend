import { test, expect } from '@playwright/test';
import { stubSignIn, getDemoEmail } from '../utils/session';

const app = process.env.PLAYWRIGHT_APP_URL!;
const qa = process.env.QA_TEST_MODE === 'true';

test('@full admin can post gig and view listing', async ({ page }) => {
  const admin = getDemoEmail('admin');
  if (qa) await stubSignIn(page, admin);
  const title = `QA Gig ${Date.now()}`;
  await page.goto(`${app}/gigs/new`, { waitUntil: 'load' });
  await page.getByTestId('gig-title').fill(title);
  await page.getByTestId('gig-description').fill('End-to-end tested gig.');
  await page.getByTestId('gig-price').fill('123');
  await page.getByTestId('gig-submit').click();
  await expect(page.getByText(/posted|na-post/i)).toBeVisible();
  await page.goto(`${app}/find`, { waitUntil: 'load' });
  await expect(page.getByText(title)).toBeVisible();
  await page.getByRole('link', { name: title }).click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
});

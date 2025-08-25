import { test, expect } from '@playwright/test';
import { stubSignIn, getDemoEmail } from '../utils/session';

const app = process.env.BASE_URL!;
const qa = process.env.QA_TEST_MODE === 'true';

test('@full admin can post gig and view listing', async ({ page }) => {
  const admin = getDemoEmail('admin');
  if (qa) await stubSignIn(page, admin);
  const title = `QA Gig ${Date.now()}`;
  await page.goto(`${app}/post`, { waitUntil: 'load' });
  await page.getByLabel(/Title|Pamagat/i).fill(title);
  await page.getByLabel(/Description|Paglalarawan/i).fill('End-to-end tested gig.');
  await page.getByRole('button', { name: /publish|post/i }).click();
  await expect(page.getByText(/posted|na-post/i)).toBeVisible();
  await page.goto(`${app}/find`, { waitUntil: 'load' });
  await expect(page.getByText(title)).toBeVisible();
  await page.getByRole('link', { name: title }).click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
});

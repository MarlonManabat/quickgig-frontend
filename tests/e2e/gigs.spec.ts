import { test, expect } from '@playwright/test';
import { stubSignIn } from '../utils/session';

const app = process.env.PLAYWRIGHT_APP_URL!;
const qa = process.env.QA_TEST_MODE === 'true';

test('@full create + edit + view gig', async ({ page }) => {
  if (qa) await stubSignIn(page);
  await page.goto(`${app}/gigs/new`, { waitUntil: 'load' });
  await page.getByLabel(/Title|Pamagat/i).fill('Playwright QA Gig');
  await page.getByLabel(/Description|Paglalarawan/i).fill('End-to-end tested gig.');
  await page.getByRole('button', { name: /publish|post/i }).click();
  await expect(page.getByText(/posted|na-post/i)).toBeVisible();
  await page.getByRole('link', { name: /My Gigs|Aking Gigs/i }).click();
  await expect(page.getByText(/Playwright QA Gig/i)).toBeVisible();
});

import { test, expect } from '@playwright/test';
import { stubSignIn } from '../utils/session';

const landing = process.env.PLAYWRIGHT_LANDING_URL!;
const app = process.env.PLAYWRIGHT_APP_URL!;
const qa = process.env.QA_TEST_MODE === 'true';

test('@smoke landing header + hero CTAs visible', async ({ page }) => {
  await page.goto(landing, { waitUntil: 'load' });
  await expect(page.getByTestId('brand')).toBeVisible();
  await expect(page.getByTestId('nav-find-work')).toBeVisible();
  await expect(page.getByTestId('cta-start-now')).toBeVisible();
});

test('@smoke app nav + core routes', async ({ page }) => {
  if (qa) await stubSignIn(page);
  await page.goto(app, { waitUntil: 'load' });
  await expect(page.getByTestId('app-nav-find-work')).toBeVisible();
  await page.getByTestId('app-nav-post-job').click();
  await expect(page.url()).toMatch(/post|gig/i);
});

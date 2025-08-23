import { test, expect } from '@playwright/test';
import { stubSignIn } from '../utils/session';

const app = process.env.PLAYWRIGHT_APP_URL!;
const qa = process.env.QA_TEST_MODE === 'true';

test('@full user onboarding creates/updates profile', async ({ page }) => {
  if (qa) await stubSignIn(page, 'new-user@quickgig.test');
  await page.goto(`${app}/profile`, { waitUntil: 'load' });
  await page.getByLabel(/Buong pangalan|Full name/i).fill('QA User');
  await page.getByRole('button', { name: /save|i-save/i }).click();
  await expect(page.getByText(/na-save|saved/i)).toBeVisible();
});

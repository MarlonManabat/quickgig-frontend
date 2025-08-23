import { test, expect } from '@playwright/test';
import { stubSignIn } from '../utils/session';

const app = process.env.PLAYWRIGHT_APP_URL!;
const qa = process.env.QA_TEST_MODE === 'true';

// simple admin dashboard access check

test('@full admin dashboard access control', async ({ page }) => {
  if (qa) await stubSignIn(page, process.env.SEED_ADMIN_EMAIL || 'demo-admin@quickgig.test');
  await page.goto(`${app}/admin`, { waitUntil: 'load' });
  await expect(page.getByRole('heading', { name: /Admin/i })).toBeVisible();
});

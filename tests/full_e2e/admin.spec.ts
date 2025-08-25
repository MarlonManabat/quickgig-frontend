import { test, expect } from '@playwright/test';
import { stubSignIn } from '../utils/session';
import { disableAnimations } from '../utils/test-login';

const app = process.env.NEXT_PUBLIC_APP_URL!;
const qa = process.env.QA_TEST_MODE === 'true';

// simple admin dashboard access check

test('@full admin dashboard access control', async ({ page }) => {
  await disableAnimations(page);
  if (qa) await stubSignIn(page, process.env.SEED_ADMIN_EMAIL || 'demo-admin@quickgig.test');
  await page.goto(`${app}/admin`);
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: /Admin/i })).toBeVisible();
});

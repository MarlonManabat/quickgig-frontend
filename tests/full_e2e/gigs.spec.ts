import { test, expect } from '@playwright/test';
import { stubSignIn, getDemoEmail } from '../utils/session';
import { disableAnimations } from '../utils/test-login';

const app = process.env.NEXT_PUBLIC_APP_URL!;
const qa = process.env.QA_TEST_MODE === 'true';

test('@full admin can post gig and view listing', async ({ page }) => {
  await disableAnimations(page);
  const admin = getDemoEmail('admin');
  if (qa) await stubSignIn(page, admin);
  const title = `QA Gig ${Date.now()}`;
  await page.goto(`${app}/post`);
  await page.waitForLoadState('networkidle');
  await page.getByLabel(/Title|Pamagat/i).fill(title);
  await page.getByLabel(/Description|Paglalarawan/i).fill('End-to-end tested gig.');
  const publish = page.getByRole('button', { name: /publish|post/i });
  await Promise.all([
    page.waitForLoadState('networkidle'),
    publish.click(),
  ]);
  await expect(page.getByText(/posted|na-post/i)).toBeVisible();
  await page.goto(`${app}/find`);
  await page.waitForLoadState('networkidle');
  const link = page.getByRole('link', { name: title });
  await expect(link).toBeVisible();
  await Promise.all([
    page.waitForURL('**/gigs/**', { timeout: 20_000 }),
    link.click(),
  ]);
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
});

import { test, expect } from '@playwright/test';

const LANDING = process.env.LANDING_URL || process.env.PREVIEW_URL || 'http://localhost:3000';

test.setTimeout(90_000);
test('Landing “Post Job/Simulan Na!” opens app /post', async ({ page }) => {
  await page.goto(LANDING, { waitUntil: 'domcontentloaded' });

  const postCta = page.getByRole('link', { name: /post job|simulan na/i }).first();
  await expect(postCta).toBeVisible();

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    postCta.click()
  ]);

  const url = new URL(page.url());
  expect(url.pathname).toMatch(/^\/post\/?$/);

  // Be flexible: “Post Job” or “Post a Job”
  const submit = page.getByRole('button', { name: /post job|post a job/i }).first();
  await expect(submit).toBeVisible({ timeout: 15000 });
});


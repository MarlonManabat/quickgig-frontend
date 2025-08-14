// @ts-nocheck
import { test, expect } from '@playwright/test';

test('find work page loads', async ({ page }) => {
  await page.goto('https://app.quickgig.ph');
  const link = page.getByRole('link', { name: /Find Work|Jobs/i }).first();
  if (await link.isVisible()) {
    await link.click();
  } else {
    await page.goto('https://app.quickgig.ph/jobs');
  }
  await page.waitForLoadState('networkidle');
  expect(page.url()).toMatch(/jobs/);
  const xhrFailures: string[] = [];
  page.on('response', r => {
    if (r.request().resourceType() === 'xhr' && r.status() >= 400) {
      xhrFailures.push(`${r.url()} ${r.status()}`);
    }
  });
  const hasList = await page.locator('[data-testid="job-card"]').first().isVisible().catch(() => false);
  const hasEmpty = await page.locator('text=/No jobs/i').first().isVisible().catch(() => false);
  expect(hasList || hasEmpty).toBeTruthy();
  expect(xhrFailures).toEqual([]);
});

import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';
const APP = process.env.PREVIEW_URL || 'http://localhost:3000';

test.setTimeout(120_000);

test('create job then list', async ({ page }) => {
  const title = `Test Gig ${randomUUID()}`;
  await page.goto(`${APP}/post`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="title"]', title);
  await page.fill('input[name="company"]', 'Test Co');
  await page.getByTestId('region-select').selectOption({ label: /(NCR|National Capital Region)/i });
  const province = page.getByTestId('province-select');
  await expect(province).toBeEnabled();
  await province.selectOption({ label: /(Metro Manila|NCR)/i });
  await page.getByTestId('city-select').selectOption({ label: /Manila/i });
  await page.getByRole('button', { name: /submit/i }).click();
  await expect(page.getByRole('status')).toHaveText(/Job posted/i);

  await page.goto(`${APP}/search`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('job-item').first()).toContainText(title);
});

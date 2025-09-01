import { test, expect } from '@playwright/test';
import { loginAs } from './helpers';

const SEED_GIG = 'Seeded E2E Gig';

test('worker applies to a gig', async ({ page, baseURL }) => {
  await loginAs(baseURL!, 'worker', page);

  await page.goto('/gigs');
  await page.getByRole('link', { name: SEED_GIG }).click();
  await page.getByRole('button', { name: /apply/i }).click();
  await expect(page.getByText(/application submitted/i)).toBeVisible();
});

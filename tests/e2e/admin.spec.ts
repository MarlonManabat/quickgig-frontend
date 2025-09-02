import { test, expect } from '@playwright/test';
import { loginAs } from './helpers';

const SEED_GIG = 'Seeded E2E Gig';

test('admin reviews applications @auth', async ({ page, baseURL }) => {
  // ensure an application exists
  await loginAs(baseURL!, 'worker', page);
  await page.goto('/gigs');
  await page.getByRole('link', { name: SEED_GIG }).click();
  const apply = page.getByRole('button', { name: /apply/i });
  if (await apply.isVisible()) {
    await apply.click();
  }

  await loginAs(baseURL!, 'admin', page);
  await page.goto('/admin/applications');
  await expect(page.getByText(/E2E Gig/i)).toBeVisible();
  const approve = page.getByRole('button', { name: /approve/i }).first();
  if (await approve.isVisible()) await approve.click();
});

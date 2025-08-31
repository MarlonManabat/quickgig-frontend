import { test, expect } from '@playwright/test';
import { goHome } from './_utils';

test('Landing header/hero CTAs', async ({ page }) => {
  await goHome(page);

  // Be flexible: header tag OR data-testid if present
  const header = page.locator('header, [data-testid="app-header"]').first();
  await expect(header, 'header should be visible').toBeVisible();

  // CTAs: accept minor copy changes
  const findWork = header.getByRole('link', { name: /find work|browse jobs|jobs/i }).first();
  const postJob  = header.getByRole('link', { name: /post job|post a job|create job/i }).first();

  await expect(findWork).toBeVisible();
  await expect(postJob).toBeVisible();

  // Links should keep same origin (app origin)
  const hrefs = await Promise.all([findWork, postJob].map(async l => await l.getAttribute('href')));
  for (const href of hrefs) {
    expect(href, 'CTA href should be present').not.toBeNull();
    const dest = new URL(href!, 'http://localhost:3000');
    expect(dest.origin).toBe('http://localhost:3000');
  }
});

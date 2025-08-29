import { test, expect } from '@playwright/test';

async function captureNoPageErrors(page: any) {
  const errors: string[] = [];
  page.on('pageerror', (e: any) => errors.push(`pageerror: ${e?.message || e}`));
  page.on('console', (msg: any) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
  });
  return () => expect(errors, errors.join('\n')).toEqual([]);
}

test('@smoke /employer/post renders without client errors', async ({ page }) => {
  const finish = await captureNoPageErrors(page);
  await page.goto('/employer/post', { waitUntil: 'domcontentloaded' });
  // Don’t assert a specific heading; just ensure the page responds and doesn’t error.
  await expect(page).toHaveURL(/\/employer\/post|\/post/);
  finish();
});

test('@smoke /find renders without client errors', async ({ page }) => {
  const finish = await captureNoPageErrors(page);
  await page.goto('/find', { waitUntil: 'domcontentloaded' });
  finish();
});

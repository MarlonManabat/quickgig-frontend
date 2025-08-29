import { test, expect } from '@playwright/test';

async function captureNoPageErrors(page: any) {
  const errors: string[] = [];
  page.on('pageerror', (e: any) => errors.push(`pageerror: ${e?.message || e}`));
  page.on('console', (msg: any) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
  });
  return () => expect(errors, errors.join('\n')).toEqual([]);
}

test('@smoke /post renders without client errors', async ({ page }) => {
  const finish = await captureNoPageErrors(page);
  await page.goto('/post', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: /Post a Job/i })).toBeVisible();
  finish();
});

test('@smoke /find renders without client errors', async ({ page }) => {
  const finish = await captureNoPageErrors(page);
  await page.goto('/find', { waitUntil: 'domcontentloaded' });
  finish();
});

test('@smoke header routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Find work/i })).toHaveAttribute('href', '/find');
  await expect(page.getByRole('link', { name: /Post job/i })).toHaveAttribute('href', '/post');
});

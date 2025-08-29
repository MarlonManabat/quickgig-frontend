import { test, expect } from '@playwright/test';

async function assertNoPageErrors(page: any) {
  const errors: any[] = [];
  page.on('pageerror', (e: any) => errors.push(e));
  page.on('console', (msg: any) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  return () => {
    expect(errors, errors.join('\n')).toEqual([]);
  };
}

test('@smoke /employer/post renders without client errors', async ({ page }) => {
  const finish = await assertNoPageErrors(page);
  await page.goto('/employer/post');
  await expect(page.getByRole('heading', { name: /Post a Job/i })).toBeVisible();
  finish();
});

test('@smoke /find renders without client errors', async ({ page }) => {
  const finish = await assertNoPageErrors(page);
  await page.goto('/find');
  finish();
});

import { test, expect } from '@playwright/test';
import { hardenSmoke } from './_utils';

test('Landing renders without runtime exceptions', async ({ page }) => {
  await hardenSmoke(page);

  const exceptions: Error[] = [];
  page.on('pageerror', (e) => {
    // ignore known dev-only noise
    if (/getInitialProps/i.test(e.message)) return;
    exceptions.push(e);
  });

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');

  expect(
    exceptions.map((e) => e.message).join('\n')
  ).toHaveLength(0);
});

import { test, expect } from '@playwright/test';

test('next param cannot redirect off-site', async ({ page }) => {
  await page.goto('/api/auth/demo?next=https://attacker.com');
  const url = page.url();
  expect(url.startsWith('http://') || url.startsWith('https://')).toBeTruthy();
  expect(new URL(url).host).not.toBe('attacker.com');
});

import { test, expect } from '@playwright/test';

const BASE_HOST = new URL(process.env.BASE || 'https://app.quickgig.ph').host;
function assertAppUrl(url: string) {
  expect(new URL(url).host).toBe(BASE_HOST);
}

test('footer links respond with 200', async ({ page, request }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  const links = ['terms', 'privacy', 'contact'];
  for (const name of links) {
    const el = footer.getByRole('link', { name: new RegExp(name, 'i') });
    const href = await el.getAttribute('href');
    if (!href) continue;
    const res = await request.get(href);
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text.toLowerCase()).toContain(name);
  }
  assertAppUrl(page.url());
});

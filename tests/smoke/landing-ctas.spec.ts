import { test, expect } from '@playwright/test';

test('landing CTAs point to app domain', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const getHref = async (sel: string) => page.locator(sel).getAttribute('href');

  await expect(await getHref('[data-e2e="hdr-findwork"]')).toContain('https://app.quickgig.ph/find');
  await expect(await getHref('[data-e2e="hdr-postjob"]')).toContain('https://app.quickgig.ph/post');
  await expect(await getHref('[data-e2e="hdr-login"]')).toContain('https://app.quickgig.ph/login');
  await expect(await getHref('[data-e2e="cta-start"]')).toContain('https://app.quickgig.ph/');
  await expect(await getHref('[data-e2e="cta-browse"]')).toContain('https://app.quickgig.ph/find');
});

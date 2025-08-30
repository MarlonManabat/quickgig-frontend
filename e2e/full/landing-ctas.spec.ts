import { test, expect } from '@playwright/test';
import { APP_ORIGIN, MARKETING_HOST } from '../helpers/env';

test.describe('Landing → App routing', () => {
  test('Simulan na → app root, Browse Jobs → app /find, header hard-links', async ({ page }) => {
    await page.goto(MARKETING_HOST, { waitUntil: 'domcontentloaded' });

    // Header hard-links
    const findHref  = await page.getByRole('link', { name: /find work/i }).getAttribute('href');
    const postHref  = await page.getByRole('link', { name: /post job/i }).getAttribute('href');
    const loginHref = await page.getByRole('link', { name: /login/i }).getAttribute('href');

    expect(findHref).toBe(`${APP_ORIGIN}/find`);
    expect(postHref).toBe(`${APP_ORIGIN}/post`);
    expect(loginHref).toBe(`${APP_ORIGIN}/login`);

    // “Simulan na” → app root
    await Promise.all([
      page.waitForURL(new RegExp(`^${APP_ORIGIN}/?$`)),
      page.getByRole('button', { name: /simulan na/i }).click(),
    ]);
    expect(page.url()).toMatch(new RegExp(`^${APP_ORIGIN}/?$`));

    // Back to landing, test “Browse Jobs”
    await page.goto(MARKETING_HOST, { waitUntil: 'domcontentloaded' });
    await Promise.all([
      page.waitForURL(`${APP_ORIGIN}/find`),
      page.getByRole('link', { name: /browse jobs/i }).click(),
    ]);
    await expect(page).toHaveURL(`${APP_ORIGIN}/find`);
  });
});

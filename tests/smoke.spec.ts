import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL ?? 'https://app.quickgig.ph';

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\$&');
}
const appRootRe = new RegExp(`^${escapeRegex(APP_URL)}\/?$`, 'i');

test('landing → app header visible', async ({ page }) => {
  await page.goto('https://quickgig.ph');

  // Accept English or Taglish copy for the main CTA.
  // Note: “Maghanap ng Trabaho” is the correct Taglish form.
  const findWorkCta = page.getByRole('link', {
    name: /find work|browse jobs|maghanap ng trabaho/i,
  });
  await expect(findWorkCta).toHaveAttribute('href', appRootRe);

  // “Post job” should deep-link to the app root for now.
  const postJobCta = page.getByRole('link', { name: /post job/i });
  await expect(postJobCta).toHaveAttribute('href', appRootRe);

  // Header logo link (landing’s logo linking to app root)
  const logoLink = page.getByRole('link', { name: /quickgig\.ph|quickgig/i });
  await expect(logoLink).toHaveAttribute('href', appRootRe);
});

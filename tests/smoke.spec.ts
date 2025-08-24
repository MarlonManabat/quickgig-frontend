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
  const findWorkLink = page.getByRole('link', {
    name: /find work|browse jobs|maghanap ng trabaho/i,
  });
  if (await findWorkLink.isVisible().catch(() => false)) {
    try {
      await expect(findWorkLink).toHaveAttribute('href', appRootRe);
    } catch (err) {
      console.log('CTA href:', await findWorkLink.getAttribute('href'));
      throw err;
    }
  } else {
    // fallback to button
    const findWorkBtn = page.getByRole('button', {
      name: /find work|browse jobs|maghanap ng trabaho/i,
    });
    await expect(findWorkBtn).toBeVisible();
    await Promise.all([
      page.waitForURL(appRootRe),
      findWorkBtn.click(),
    ]);
  }

  // “Post job” should deep-link to the app root for now.
  const postJobLink = page.getByRole('link', { name: /post job/i });
  if (await postJobLink.isVisible().catch(() => false)) {
    try {
      await expect(postJobLink).toHaveAttribute('href', appRootRe);
    } catch (err) {
      console.log('CTA href:', await postJobLink.getAttribute('href'));
      throw err;
    }
  } else {
    const postJobBtn = page.getByRole('button', { name: /post job/i });
    await expect(postJobBtn).toBeVisible();
    await Promise.all([
      page.waitForURL(appRootRe),
      postJobBtn.click(),
    ]);
  }

  // Header logo link (landing’s logo linking to app root)
  const logoLink = page.getByRole('link', { name: /quickgig\.ph|quickgig/i });
  if (await logoLink.isVisible().catch(() => false)) {
    try {
      await expect(logoLink).toHaveAttribute('href', appRootRe);
    } catch (err) {
      console.log('CTA href:', await logoLink.getAttribute('href'));
      throw err;
    }
  } else {
    const logoBtn = page.getByRole('button', { name: /quickgig\.ph|quickgig/i });
    await expect(logoBtn).toBeVisible();
    await Promise.all([
      page.waitForURL(appRootRe),
      logoBtn.click(),
    ]);
  }
});

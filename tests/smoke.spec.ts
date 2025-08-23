import { test, expect } from '@playwright/test';

test('landing → app header visible', async ({ page }) => {
  await page.goto('https://quickgig.ph');

  // Accept English or Taglish copy for the main CTA.
  // Note: “Maghanap ng Trabaho” is the correct Taglish form.
  const findWorkCta = page.getByRole('link', {
    name: /find work|browse jobs|maghanap ng trabaho/i,
  });
  await expect(findWorkCta).toHaveAttribute(
    'href',
    /https:\/\/app\.quickgig\.ph\/?$/i
  );

  // “Post job” should deep-link to the job creation route in the app.
  const postJobCta = page.getByRole('link', { name: /post job/i });
  await expect(postJobCta).toHaveAttribute(
    'href',
    /https:\/\/app\.quickgig\.ph\/gigs\/(new|create)\/?$/i
  );

  // Auth CTA (Login/Sign up) goes straight to the app.
  const authCta = page.getByRole('link', { name: /sign up|mag-login/i });
  await expect(authCta).toHaveAttribute(
    'href',
    /https:\/\/app\.quickgig\.ph\/?$/i
  );
});

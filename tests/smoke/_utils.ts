import { Page, expect } from '@playwright/test';

export async function hardenSmoke(page: Page) {
  // Block or stub ALL external REST calls so the landing always renders.
  await page.route('**/rest/v1/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      // lightweight empty payload
      body: '[]',
      headers: { 'access-control-allow-origin': '*' },
    })
  );

  // Optional: neuter third-party pixels/fonts to avoid timeouts
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (/fonts\.gstatic|googletag|facebook|intercom|segment/.test(url)) {
      return route.fulfill({ status: 204, body: '' });
    }
    return route.continue();
  });
}

export async function goHome(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const main = page.getByRole('main').first();
  await expect(main).toBeVisible({ timeout: 15_000 });
  await page.waitForLoadState('networkidle');
}

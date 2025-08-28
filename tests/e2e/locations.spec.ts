import { test, expect } from '@playwright/test';
import { loginAs } from './_helpers/session';

const app = process.env.PLAYWRIGHT_APP_URL!;

const REQUIRED = ['Quezon City', 'Makati', 'Pasig', 'Taguig', 'Manila'];

test('NCR city list is complete', async ({ page }) => {
  await loginAs(page, 'employer');
  await page.goto(`${app}/post`);
  await page.waitForSelector('[data-testid="job-form"]');
  await page.getByTestId('region-select').selectOption({ label: 'National Capital Region' });
  await page.getByTestId('province-select').selectOption({ label: 'Metro Manila' });
  const options = await page.$$eval(
    '[data-testid="city-select"] option',
    (opts) => opts.map((o) => o.textContent?.trim()).filter(Boolean) as string[],
  );
  for (const city of REQUIRED) {
    if (!options.includes(city)) {
      await test.info().attach('screenshot', {
        body: await page.screenshot(),
        contentType: 'image/png',
      });
      throw new Error(`Missing city ${city}`);
    }
  }
  expect(options.length).toBeGreaterThanOrEqual(5);
});

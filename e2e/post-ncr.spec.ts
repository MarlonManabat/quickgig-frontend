import { test, expect } from '@playwright/test';
const APP = process.env.PREVIEW_URL || 'http://localhost:3000';

test.setTimeout(120_000);
test('/post: NCR → Metro Manila → 17 LGUs', async ({ page }) => {
  await page.goto(`${APP}/post`, { waitUntil: 'domcontentloaded' });

  // Pick Region first
  const region = page.getByLabel(/Region/i);
  await expect(region).toBeVisible();
  await region.selectOption({ label: /(NCR|National Capital Region)/i });

  // 🔧 Wait for Province/HUC select to become enabled and hydrated
  const province = page.getByLabel(/Province|Metro|HUC/i);
  await expect(province).toBeEnabled({ timeout: 15000 });
  await expect(page.locator('select[name="province"] option')).toHaveCountGreaterThan(1);

  // Now choose Metro Manila
  await province.selectOption({ label: /(Metro Manila|NCR)/i });

  // Cities should appear (1 placeholder + 17 LGUs)
  const cityOptions = page.locator('select[name="city"] option');
  await expect(cityOptions).toHaveCount(18, { timeout: 15000 });
  await expect(page.locator('select[name="city"]')).toContainText(/Pateros/i);
});

// Small helper (extend expect)
declare global {
  // eslint-disable-next-line no-var
  var expect: typeof expect & {
    (locator: import('@playwright/test').Locator): {
      toHaveCountGreaterThan(n: number): Promise<void>;
    };
  };
}
expect.extend({
  async toHaveCountGreaterThan(locator, n) {
    const pass = await locator.evaluateAll((els, min) => els.length > min, n);
    return {
      pass,
      message: () => `Expected count > ${n}`,
    };
  },
});

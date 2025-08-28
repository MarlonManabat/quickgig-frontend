import { expect, Page, APIRequestContext } from '@playwright/test';

export async function loginAs(page: Page, role: 'worker' | 'employer' | 'admin') {
  const res = await page.request.post('/api/test/login', { data: { role } });
  expect(res.status(), 'login status').toBeLessThan(400);
}

export async function seedBasic(request: APIRequestContext) {
  const r = await request.post('/api/test/seed', { data: {} });
  expect(r.status(), 'seed status').toBeLessThan(400);
}

export async function waitForAppReady(page: Page) {
  const headerSel = '[data-testid="app-header"]';
  const mainSel = 'main';
  const deadline = Date.now() + 30_000;
  let attempt = 0;
  let reloaded = false;

  while (Date.now() < deadline) {
    try {
      const remaining = deadline - Date.now();
      const timeout = Math.min(20_000, remaining);
      await page.waitForSelector(headerSel, { state: 'visible', timeout });
      await page.waitForSelector(mainSel, { state: 'attached', timeout });
      return;
    } catch (err) {
      attempt += 1;
      console.warn(`waitForAppReady retry ${attempt}`, err);
      if (!reloaded) {
        reloaded = true;
        console.warn('waitForAppReady: reload page');
        await page.reload();
      }
      const delay = Math.min(500 * 2 ** (attempt - 1), 5_000);
      await page.waitForTimeout(delay);
    }
  }
  throw new Error('waitForAppReady: timed out after 30s');
}

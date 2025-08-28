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
  await page.waitForSelector('[data-testid="app-header"]', { state: 'visible' });
  await page.waitForSelector('main', { state: 'attached' });
}

import { Page, APIRequestContext, expect } from '@playwright/test';
export async function loginAs(page: Page, role: 'worker'|'employer'|'admin') {
  const res = await page.request.post('/api/test/login', { data: { role } });
  expect(res.ok()).toBeTruthy();
}
export async function seedBasic(request: APIRequestContext) {
  const r = await request.post('/api/test/seed', { data: {} });
  expect(r.ok()).toBeTruthy();
}

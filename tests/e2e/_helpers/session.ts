import { Page, APIRequestContext } from '@playwright/test';
export async function loginAs(page: Page, role: 'worker'|'employer'|'admin') {
  const res = await page.request.post('/api/test/login', { data: { role } });
  if (!res.ok()) {
    const text = await res.text().catch(() => '');
    throw new Error(`login failed: ${res.status()} ${text}`);
  }
}
export async function seedBasic(request: APIRequestContext) {
  const res = await request.post('/api/test/seed', { data: {} });
  if (!res.ok()) {
    const text = await res.text().catch(() => '');
    throw new Error(`seed failed: ${res.status()} ${text}`);
  }
}

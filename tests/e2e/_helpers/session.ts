import { expect, Page, APIRequestContext } from '@playwright/test';

export async function loginAs(page: Page, role: 'worker' | 'employer' | 'admin') {
  const res = await page.request.post('/api/test/login', { data: { role } });
  expect(res.status(), 'login status').toBeLessThan(400);
}

export async function seedBasic(request: APIRequestContext) {
  const r = await request.post('/api/test/seed', { data: {} });
  expect(r.status(), 'seed status').toBeLessThan(400);
}

export async function waitForAppReady(
  page: Page,
  { timeout = 15_000 }: { timeout?: number } = {},
) {
  const attempt = async () => {
    await page.waitForLoadState('domcontentloaded', { timeout });
    try {
      await page.waitForLoadState('networkidle', { timeout });
    } catch {
      /* ignore */
    }

    await page.waitForSelector('main, [role="main"], [data-testid="page-root"]', {
      state: 'attached',
      timeout,
    });

    const content = page.locator(
      'main :is(h1, h2, form, a, input, button, [data-testid]), [data-testid="page-root"] *',
    );
    await content.first().waitFor({ state: 'attached', timeout });
  };

  try {
    await attempt();
  } catch (e) {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await attempt();
  }
}

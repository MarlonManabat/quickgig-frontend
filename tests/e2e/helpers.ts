import { request, expect, Page } from '@playwright/test';

export async function loginAs(baseURL: string, role: 'employer' | 'worker' | 'admin', page: Page) {
  const ctx = await request.newContext({ baseURL });
  const r = await ctx.post('/api/test/login-as', { data: { role } });
  expect(r.ok()).toBeTruthy();
  const { access_token, email } = await r.json();
  const payload = JSON.parse(Buffer.from(access_token.split('.')[1], 'base64').toString());
  const userId = payload.sub as string;
  await page.goto('/auth/confirm?token=' + encodeURIComponent(access_token));
  return { accessToken: access_token, email, userId };
}

export const isProdBase = () => {
  const u = process.env.BASE_URL || '';
  return /app\.quickgig\.ph/i.test(u);
};

// Wait for either the intended destination OR a bounce to /login?next=...
export async function expectAuthAwareRedirect(
  page: Page,
  destPathPattern: RegExp, // e.g. /\/gigs\/create\/?$/
  timeout = 8000
) {
  const host = 'https?:\\/\\/[^/]+'; // match any host (localhost or preview)
  const dest = new RegExp(`${host}${destPathPattern.source}`);
  const login = new RegExp(`${host}\/login(\\?.*)?$`);

  await Promise.race([
    page.waitForURL(dest, { timeout }),
    page.waitForURL(login, { timeout }),
  ]);
}

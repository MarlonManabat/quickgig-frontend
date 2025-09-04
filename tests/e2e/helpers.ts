import { request, expect, Page } from '@playwright/test';

export const APP_HOST = /(https?:\/\/(app\.quickgig\.ph|localhost:3000))/;
export const isProdBase = () =>
  /app\.quickgig\.ph/i.test(process.env.BASE_URL || "");

export function expectAuthAwareRedirect(page: Page, destRe: RegExp) {
  // Either we land on dest, or we get kicked to /login (with any ?next)
  return Promise.race([
    page.waitForURL(destRe, { timeout: 8000 }),
    page.waitForURL(new RegExp(`${APP_HOST.source}\/login(\?.*)?$`), {
      timeout: 8000,
    }),
  ]);
}

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

// isProdBase defined above

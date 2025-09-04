import { request, expect, Page } from "@playwright/test";

export const isProdBase = () =>
  /app\.quickgig\.ph/i.test(process.env.BASE_URL || "");

/**
 * Wait until we're either on the intended destination path
 * OR we've been kicked to /login (any query/hash).
 *
 * Use Playwright's glob patterns to avoid brittle host/regex composition.
 */
export async function expectAuthAwareRedirect(page: Page, destGlob: string) {
  await Promise.race([
    page.waitForURL(destGlob, {
      timeout: 8000,
      waitUntil: "domcontentloaded",
    }),
    page.waitForURL("**/login**", {
      timeout: 8000,
      waitUntil: "domcontentloaded",
    }),
  ]);
}

/** Convenience for path inspection without host noise */
export function currentPath(page: Page): string {
  return new URL(page.url()).pathname;
}

export async function loginAs(
  baseURL: string,
  role: "employer" | "worker" | "admin",
  page: Page,
) {
  const ctx = await request.newContext({ baseURL });
  const r = await ctx.post("/api/test/login-as", { data: { role } });
  expect(r.ok()).toBeTruthy();
  const { access_token, email } = await r.json();
  const payload = JSON.parse(
    Buffer.from(access_token.split(".")[1], "base64").toString(),
  );
  const userId = payload.sub as string;
  await page.goto(
    "/auth/confirm?token=" + encodeURIComponent(access_token),
  );
  return { accessToken: access_token, email, userId };
}

// isProdBase defined above


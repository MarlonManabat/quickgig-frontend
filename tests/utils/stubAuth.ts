import type { Page } from "@playwright/test";

export async function stubAuth(page: Page) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const refMatch = url.match(/https?:\/\/(.*)\.supabase\.co/);
  const ref = refMatch ? refMatch[1] : "local";
  await page.addInitScript(
    ({ ref }) => {
      const key = `sb-${ref}-auth-token`;
      const payload = {
        currentSession: {
          access_token: "stub",
          token_type: "bearer",
          user: { id: "stub-user", email: "stub@example.com" },
        },
        expiresAt: Math.floor(Date.now() / 1000) + 60,
      };
      window.localStorage.setItem(key, JSON.stringify(payload));
    },
    { ref },
  );
  if (url) {
    await page.route(`${url}/auth/v1/user`, (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: { id: "stub-user", email: "stub@example.com" },
        }),
      });
    });
    await page.route(new RegExp(`${url}/rest/v1/profiles.*`), (route) => {
      if (route.request().method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{ id: "stub-user", full_name: "" }]),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    });
  }
}

import { test, expect } from "@playwright/test";

const app = process.env.PLAYWRIGHT_APP_URL!;

// Basic end-to-end check using data-testid selectors only

test("home page renders with header and login", async ({ page }) => {
  const res = await page.goto(app, { waitUntil: "load" });
  expect(res?.status()).toBe(200);
  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("app-login")).toBeVisible();
});

import { test, expect } from "@playwright/test";
import { stubAuth } from "./utils/stubAuth";
import { failOnConsoleErrors } from "./utils/consoleFail";

test.describe("@smoke auth guards", () => {
  test.beforeEach(async ({ page }) => {
    failOnConsoleErrors(page);
  });

  test("redirects to auth when signed out", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForURL(/\/auth/);
  });

  test("redirect preserves intended page", async ({ page }) => {
    await page.goto("/applications");
    await page.waitForURL(/\/auth\?next=%2Fapplications/);
  });

  test("profile loads with stubbed auth", async ({ page }) => {
    await stubAuth(page);
    await page.goto("/profile");
    await expect(page.getByTestId("profile-save")).toBeVisible();
  });

  test("callback handles invalid code", async ({ page }) => {
    await page.route("**/auth/v1/token*", (route) => {
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: "{}",
      });
    });
    await page.route("**/auth/v1/user", (route) => {
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: "{}",
      });
    });
    await page.goto("/auth/callback?code=fake");
    await expect(page.getByText(/Login failed/i)).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";
import { stubAuth } from "./utils/stubAuth";
import { failOnConsoleErrors } from "./utils/consoleFail";

test.describe("support and account deletion", () => {
  test.beforeEach(async ({ page }) => {
    failOnConsoleErrors(page);
    await stubAuth(page);
  });

  test("support ticket submit", async ({ page }) => {
    await page.route("**/rest/v1/support_tickets", (route) => {
      if (route.request().method() === "POST") {
        route.fulfill({ status: 201, body: "{}" });
      }
    });
    await page.goto("/support");
    await page.fill('input[placeholder="Email (optional)"]', "me@test.com");
    await page.fill('input[placeholder="Subject"]', "Help");
    await page.fill('textarea[placeholder="How can we help?"]', "Issue");
    await page.click('[data-testid="support-submit"]');
    await expect(
      page.getByText("Thanks! We received your message."),
    ).toBeVisible();
  });

  test("account deletion flow", async ({ page }) => {
    await page.route("**/rest/v1/rpc/request_account_deletion", (route) => {
      route.fulfill({ status: 200, body: "{}" });
    });
    await page.route("**/rest/v1/profiles?select=email*", (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([{ email: "stub@example.com" }]),
      });
    });
    await page.route("**/auth/v1/logout", (route) => {
      route.fulfill({ status: 200, body: "{}" });
    });
    await page.goto("/settings/account");
    page.on("dialog", (d) => d.accept());
    await page.click('[data-testid="account-delete"]');
    await expect(page.getByText("Deletion scheduled")).toBeVisible();
  });
});

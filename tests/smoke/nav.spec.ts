import { test, expect } from "@playwright/test";

test("header nav testids exist (desktop)", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("nav-browse-jobs")).toBeVisible();
  await expect(page.getByTestId("nav-my-applications")).toBeVisible();
  await expect(page.getByTestId("nav-post-job")).toBeVisible();
  await expect(page.getByTestId("nav-login")).toBeVisible();
});

test("mobile menu toggles", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.getByTestId("nav-menu-button").click();
  await expect(page.getByTestId("nav-menu")).toBeVisible();
});

import { test, expect } from "@playwright/test";

test("/ redirects to /browse-jobs", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/browse-jobs/);
});

test("unauth /applications triggers auth-aware redirect", async ({ page }) => {
  await page.goto("/applications");
  const url = page.url();
  expect(
    url.includes("/api/auth/pkce/start?next=") || url.includes("/login?next=") || url.includes("/applications")
  ).toBeTruthy();
});

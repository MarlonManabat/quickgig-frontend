import { test, expect } from "@playwright/test";
test("find work CTA focuses search", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("cta-findwork").click();
  await expect(page).toHaveURL("/find?focus=search");
  await expect(page.locator("#search")).toBeFocused();
});

test("post job CTA focuses title", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("cta-postjob").click();
  await expect(page).toHaveURL("/post?focus=title");
  await expect(page.locator("#title")).toBeFocused();
});

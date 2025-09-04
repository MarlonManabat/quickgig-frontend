import { test, expect } from "@playwright/test";

test("legacy /find redirects to /browse-jobs", async ({ page }) => {
  await page.goto("/find");
  await expect(page).toHaveURL("**/browse-jobs**");
});

test("legacy /post-job redirects to /gigs/create", async ({ page }) => {
  await page.goto("/post-job");
  await expect(page).toHaveURL("**/gigs/create**");
});

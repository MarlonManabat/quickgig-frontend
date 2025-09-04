import { test, expect } from "@playwright/test";
const APP_HOST = /(https?:\/\/(app\.quickgig\.ph|localhost:3000))/;

test("Post Job form \u203a renders form or skeleton", async ({ page }) => {
  await page.goto("/gigs/create");
  await page.waitForLoadState("domcontentloaded");

  const url = page.url();

  // \u2705 If unauthenticated, redirect to /login is a PASS condition.
  if (/\/login(?:\/|\?|$)/i.test(url)) {
    await expect(page).toHaveURL(new RegExp(`${APP_HOST.source}\/login(?:\?.*)?$`));
    // Optional sanity: look for any obvious login UI, but don't fail if markup changes
    await expect.soft(
      page
        .getByRole("heading", { name: /sign in|log in/i })
        .or(page.getByRole("button", { name: /sign in|log in/i }))
        .or(page.getByLabel(/email|password/i))
    ).toBeVisible({ timeout: 5000 });
    return;
  }

  // \u2705 If not redirected, ensure the form heading OR skeleton appears
  const heading = page.getByRole("heading", { name: /post a job/i });
  const skeleton = page.getByTestId("post-job-skeleton");
  await expect(heading.or(skeleton)).toBeVisible({ timeout: 10000 });

  if (await heading.isVisible()) {
    await expect(page.getByLabel("Title")).toBeVisible();
    await expect(page.getByLabel("Description")).toBeVisible();
  }
});

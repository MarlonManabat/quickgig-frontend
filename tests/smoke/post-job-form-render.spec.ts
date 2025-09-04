import { test, expect } from "@playwright/test";

const APP_HOST = /(https?:\/\/(app\.quickgig\.ph|localhost:3000))/;

test("Post Job form › renders form or skeleton", async ({ page }) => {
  await page.goto("/gigs/create");
  await page.waitForLoadState("domcontentloaded");
  const url = page.url();

  // If unauthenticated, we should be redirected to login (this is OK)
  if (/\/login(\/|\?|$)/.test(url)) {
    await expect(page).toHaveURL(
      new RegExp(`${APP_HOST.source}\/(login|applications\/login)(\?.*)?$`)
    );
    await expect(
      page.getByRole("heading", { name: /sign in|sign up|login/i })
    ).toBeVisible({ timeout: 7000 });
    return;
  }

  // Otherwise the page should show the form heading or the skeleton
  const heading = page.getByRole("heading", { name: /post a job/i });
  const skeleton = page.getByTestId("post-job-skeleton");
  await expect(heading.or(skeleton)).toBeVisible({ timeout: 7000 });
  // Basic fields visible when not skeleton
  if (await heading.isVisible()) {
    await expect(page.getByLabel("Title")).toBeVisible();
    await expect(page.getByLabel("Description")).toBeVisible();
  }
});


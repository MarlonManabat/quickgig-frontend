import { test, expect } from "@playwright/test";

const APP_HOST = /(https?:\/\/(app\.quickgig\.ph|localhost:3000))/;

test("Post Job form › renders form or skeleton", async ({ page }) => {
  await page.goto("/gigs/create");
  await page.waitForLoadState("domcontentloaded");
  const url = page.url();

  // If unauthenticated, being on /login is a PASS condition
  if (/\/login(?:\/|\?|$)/i.test(url)) {
    await expect(page).toHaveURL(
      new RegExp(`${APP_HOST.source}\/login(?:\?.*)?$`)
    );
    await expect(
      page
        .getByRole("heading", { name: /sign in|sign up|log in/i })
        .or(page.getByRole("button", { name: /sign in|log in/i }))
    ).toBeVisible({ timeout: 7000 });
    return;
  }

  // Otherwise: we must see the form heading or the skeleton
  const heading = page.getByRole("heading", { name: /post a job/i });
  const skeleton = page.getByTestId("post-job-skeleton");
  await expect(heading.or(skeleton)).toBeVisible({ timeout: 10000 });

  if (await heading.isVisible()) {
    await expect(page.getByLabel("Title")).toBeVisible();
    await expect(page.getByLabel("Description")).toBeVisible();
  }
});


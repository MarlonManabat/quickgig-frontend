import { test, expect } from "@playwright/test";
import { currentPath } from "../e2e/helpers";

test("Post Job form › renders form or redirects", async ({ page }) => {
  await page.goto("/gigs/create", { waitUntil: "domcontentloaded" });

  // ✅ If unauthenticated, redirect to /login is success
  if (currentPath(page).startsWith("/login")) {
    await expect
      .soft(
        page
          .getByRole("heading", { name: /sign in|log in/i })
          .or(page.getByRole("button", { name: /sign in|log in/i })),
      )
      .toBeVisible({ timeout: 5000 });
    return;
  }

  // ✅ Otherwise: form heading OR skeleton must render
  const heading = page.getByRole("heading", { name: /post a job/i });
  const skeleton = page.getByTestId("post-job-skeleton");
  await expect(heading.or(skeleton)).toBeVisible({ timeout: 10000 });

  if (await heading.isVisible()) {
    await expect(page.getByLabel("Title")).toBeVisible();
    await expect(page.getByLabel("Description")).toBeVisible();
  }
});


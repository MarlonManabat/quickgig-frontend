import { test, expect } from "@playwright/test";

const APP_HOST = /(https?:\/\/(app\.quickgig\.ph|localhost:3000))/;

test("My Applications link redirects when signed out", async ({ page }) => {
  // Land on a stable page that shows the app header
  await page.goto("/browse-jobs");
  const link = page
    .getByTestId("nav-my-applications")
    .or(page.getByRole("link", { name: /my applications/i }));
  await expect(link).toBeVisible();
  await Promise.all([page.waitForLoadState("domcontentloaded"), link.click()]);
  await expect(page).toHaveURL(
    new RegExp(
      `${APP_HOST.source}\\/(login|applications\\/login|applications)(\\?.*)?$`
    )
  );
});


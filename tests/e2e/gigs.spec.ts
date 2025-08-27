import { test, expect } from "@playwright/test";
import { loginAs } from "./_helpers/session";

const app = process.env.PLAYWRIGHT_APP_URL!;

test("@full admin can post gig and view listing", async ({ page }) => {
  await loginAs(page, 'employer');
  const title = `QA Gig ${Date.now()}`;
  await page.goto(`${app}/post`, { waitUntil: "load" });
  await page.getByLabel(/Title|Pamagat/i).fill(title);
  await page
    .getByLabel(/Description|Paglalarawan/i)
    .fill("End-to-end tested gig.");
  await page.getByTestId("region-select").selectOption({ label: "NCR" });
  await page.getByTestId("city-select").selectOption({ label: "Quezon City" });
  await page.getByRole("button", { name: /publish|post/i }).click();
  await expect(page.getByText(/posted|na-post/i)).toBeVisible();
  await page.goto(`${app}/find`, { waitUntil: "load" });
  await expect(page.getByText(title)).toBeVisible();
  await page.getByRole("link", { name: title }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
});

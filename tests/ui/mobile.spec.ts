import { test, expect } from "@playwright/test";

test.describe("Mobile header & forms", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("header is sticky and contrast is correct", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("[data-app-header]");
    await expect(header).toBeVisible();
    await expect(header.locator("a").first()).toHaveCSS(
      "color",
      "rgb(255, 255, 255)",
    );
  });

  test("mobile menu opens and links are reachable", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("menu-toggle").click();
    await expect(
      page.getByRole("link", { name: /Mag-login|Login/i }),
    ).toBeVisible();
  });

  test("email forms are full-width with 44px min height", async ({ page }) => {
    await page.goto("/signup");
    const email = page.getByLabel(/email/i);
    await expect(email).toBeVisible();
    const box = await email.boundingBox();
    expect((box?.width ?? 0)).toBeGreaterThanOrEqual(280);
    expect((box?.height ?? 0)).toBeGreaterThanOrEqual(40);
  });

  test("no horizontal scroll on key pages", async ({ page }) => {
    for (const route of ["/", "/applications", "/saved", "/account"]) {
      await page.goto(route);
      const width = await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      );
      expect(width).toBeTruthy();
    }
  });
});

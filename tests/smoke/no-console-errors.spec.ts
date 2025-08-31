import { test, expect } from "@playwright/test";
import { captureConsole } from "../e2e/_helpers/console";

test("Landing renders without console errors", async ({ page }) => {
  await captureConsole(page, "console-home.txt");
  let hasError = false;
  page.on("console", (msg) => {
    if (msg.type() === "error") hasError = true;
  });
  await page.goto("/");
  expect(hasError).toBeFalsy();
});

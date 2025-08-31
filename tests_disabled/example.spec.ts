import { test, expect } from "@playwright/test";
import { failOnConsoleErrors } from "./utils/consoleFail";

test("dummy example", async ({ page }) => {
  failOnConsoleErrors(page);
  await expect(1 + 1).toBe(2);
});

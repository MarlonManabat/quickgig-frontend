import type { Page } from "@playwright/test";
import type { TestInfo } from "@playwright/test";

// Attach and fail on any console.error during a test
export function failOnConsoleErrors(page: Page, testInfo: TestInfo) {
  page.on("console", async (msg) => {
    if (msg.type() === "error") {
      await testInfo.attach("console-error", {
        body: msg.text(),
        contentType: "text/plain",
      });
      throw new Error(`Console error: ${msg.text()}`);
    }
  });
}

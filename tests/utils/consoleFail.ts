import { test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      // Fail immediately on console errors
      test.info().attachments.set('console-error', { body: msg.text(), contentType: 'text/plain' });
      throw new Error(`Console error: ${msg.text()}`);
    }
  });
});

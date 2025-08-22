import { test, expect } from '@playwright/test';
import '../utils/consoleFail';

test('unrelated user sees friendly access message on /applications/<id>', async ({ page }) => {
  await page.goto('/applications/999999'); // harmless invalid id path
  await expect(page.getByText(/not allowed|no access|not public/i)).toBeVisible();
});

import { test, expect } from '@playwright/test'

test('smoke \u2192 app header visible', async ({ page }) => {
  await page.goto('/app')
  await expect(page.getByTestId('app-header')).toBeVisible({ timeout: 20_000 })
})


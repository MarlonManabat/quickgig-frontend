import { test, expect } from '@playwright/test'
import { LANDING_URL, APP_URL } from './helpers/env'
import { loginViaMagicLink } from './helpers/auth'

test('landing → app header visible', async ({ page }) => {
  await page.goto(LANDING_URL)
  await expect(page.getByRole('link', { name: /find work/i })).toBeVisible()
  await page.goto(APP_URL)
  try {
    await loginViaMagicLink(page)
  } catch (e) {
    console.log('[smoke] skipping login:', String(e))
  }
  await expect(page.getByRole('link', { name: /find work/i })).toBeVisible()
})

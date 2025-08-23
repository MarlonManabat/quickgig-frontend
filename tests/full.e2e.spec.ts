import { test, expect } from '@playwright/test'
import { APP_URL, TEST_EMAIL_ADMIN } from './helpers/env'
import { loginViaMagicLink } from './helpers/auth'

test('create gig → save → upload proof → admin approves', async ({ page, browser }) => {
  await page.goto(APP_URL)
  await loginViaMagicLink(page)
  await page.goto(`${APP_URL}/gigs/new`)
  await page.getByLabel(/title/i).fill('Playwright Test Gig')
  await page.getByLabel(/description/i).fill('Automated E2E gig')
  await page.getByLabel(/price/i).fill('123')
  await page.getByRole('button', { name: /save|create/i }).click()
  await expect(page).toHaveURL(/\/gigs\/\d+$/)
  if (await page.getByRole('button', { name: /save/i }).isVisible()) {
    await page.getByRole('button', { name: /save/i }).click()
    await page.getByRole('button', { name: /unsave/i }).click()
  }
  await page.goto(`${APP_URL}/pay`)
  await page.setInputFiles('input[type="file"]', {
    name: 'proof.png',
    mimeType: 'image/png',
    buffer: Buffer.from('img'),
  })
  await page.getByRole('button', { name: /submit/i }).click()

  const ctx = await browser.newContext()
  const admin = await ctx.newPage()
  await admin.goto(APP_URL)
  await loginViaMagicLink(admin, TEST_EMAIL_ADMIN)
  await admin.goto(`${APP_URL}/admin/payments`)
  const approve = admin.getByRole('button', { name: /approve/i }).first()
  if (await approve.isVisible()) await approve.click()
})

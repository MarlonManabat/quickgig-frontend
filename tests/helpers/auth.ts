import { request } from '@playwright/test'
import { APP_URL, TEST_EMAIL } from './env'

export async function loginViaMagicLink(page, email = TEST_EMAIL) {
  const ctx = await request.newContext()
  const r = await ctx.post(`${APP_URL}/api/test/magic-link`, { data: { email } })
  const { link } = await r.json()
  await page.goto(link)
}

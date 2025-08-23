import { request } from '@playwright/test'
import { APP_URL, TEST_EMAIL } from './env'

export async function loginViaMagicLink(page, email = TEST_EMAIL) {
  const ctx = await request.newContext()
  const r = await ctx.post(`${APP_URL}/api/test/magic-link`, { data: { email } })
  const body = await r.text()
  if (r.status() !== 200) {
    throw new Error(`[magic-link] ${r.status()} ${r.statusText()} — ${body.slice(0, 160)}`)
  }
  let link: string
  try {
    link = JSON.parse(body).link
  } catch (e) {
    throw new Error(`[magic-link] Non-JSON response: ${body.slice(0, 160)}`)
  }
  await page.goto(link)
}

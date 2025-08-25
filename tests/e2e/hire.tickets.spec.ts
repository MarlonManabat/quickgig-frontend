import { test, expect } from '@playwright/test'
import { stubSignIn } from '../utils/session'

const qa = process.env.QA_TEST_MODE === 'true'

const employerEmail = 'demo-user@quickgig.test'
const workerEmail = 'demo-worker@quickgig.test'

test.beforeAll(async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/api/test/seed`)
  expect(res.ok()).toBeTruthy()
})

test('@full hire requires tickets', async ({ page }) => {
  if (qa) await stubSignIn(page, employerEmail)

  const headers = { 'x-qa-secret': process.env.QA_TEST_SECRET || '' }
  const seed = await page.request.post('/api/qa/seed-hire-scenario', {
    data: { employerEmail, workerEmail },
    headers,
  })
  expect(seed.ok()).toBeTruthy()
  const { hireUrl, employerId } = await seed.json()

  await page.goto(hireUrl)
  page.on('dialog', d => d.accept())
  await page.getByRole('button', { name: /accept/i }).click()
  await expect(page).toHaveURL(/\/pay$/)

  await page.request.post('/api/qa/credit-tickets', {
    data: { userId: employerId, tickets: 1 },
    headers,
  })
  await page.goto(hireUrl)
  await page.getByRole('button', { name: /accept/i }).click()
  await expect(page.getByText(/status:\s*accepted/i)).toBeVisible()
})

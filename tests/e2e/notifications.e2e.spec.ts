import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { stubSignIn } from '../utils/session'
import { seedAndGet } from '../helpers/seed'

const app = process.env.BASE_URL!
const employerEmail = 'demo-user@quickgig.test'
const workerEmail = 'new-user@quickgig.test'

test('notifications flow', async ({ page }) => {
  const { employerId, workerId, gigId, applicationId } = await seedAndGet(
    app,
    process.env.QA_TEST_SECRET!
  )
  const supa = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  await supa.from('notifications').insert({
    user_id: workerId,
    type: 'offer_sent',
    title: 'You received an offer',
    body: `Good news! An employer sent you an offer on “Seed Gig”.\nReview and accept if you’re interested.`,
    link: `${app}/applications/${applicationId}`,
    uniq_key: `offer_sent:${applicationId}`,
  })

  await stubSignIn(page, workerEmail)
  await page.goto(`${app}/`)
  await expect(page.locator('a[aria-label="Notifications"] span')).toHaveText('1')

  await page.locator('a[aria-label="Notifications"]').click()
  await expect(page).toHaveURL(/\/notifications$/)
  const item = page.getByTestId('notifications-list').locator('li').first()
  await expect(item).toContainText('You received an offer')
  await item.getByRole('button', { name: /mark as read/i }).click()
  await expect(page.locator('a[aria-label="Notifications"] span')).toHaveCount(0)

  await supa.from('notifications').insert({
    user_id: employerId,
    type: 'offer_accepted',
    title: 'Your offer was accepted',
    body: `Your offer for “Seed Gig” was accepted. You’re now hired!`,
    link: `${app}/gigs/${gigId}`,
    uniq_key: `offer_accepted:${applicationId}`,
  })

  await supa.from('notifications').insert({
    user_id: employerId,
    type: 'gcash_approved',
    title: 'GCash top-up approved',
    body: `We added 1 ticket(s) to your balance. Salamat!`,
    link: `${app}/account/wallet`,
    uniq_key: `gcash_approved:test`,
  })

  await stubSignIn(page, employerEmail)
  await page.goto(`${app}/notifications`)
  await expect(page.getByTestId('notifications-list')).toContainText('Your offer was accepted')
  await expect(page.getByTestId('notifications-list')).toContainText('GCash top-up approved')
})

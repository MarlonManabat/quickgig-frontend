import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { stubSignIn } from '../utils/session'

const app = process.env.PLAYWRIGHT_APP_URL!
const employerEmail = 'demo-user@quickgig.test'
const employerId = '00000000-0000-0000-0000-000000000001'
const workerEmail = 'new-user@quickgig.test'
const workerId = '00000000-0000-0000-0000-000000000002'

test('notifications flow', async ({ page }) => {
  const supa = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
  const { data: gig } = await supa
    .from('gigs')
    .insert({ owner_id: employerId, title: 'Notif', description: 'n', budget: 1 })
    .select('id, title')
    .single()
  const { data: appRow } = await supa
    .from('applications')
    .insert({ gig_id: gig!.id, applicant_id: workerId, status: 'pending' })
    .select('id')
    .single()

  await supa.from('notifications').insert({
    user_id: workerId,
    type: 'offer_sent',
    title: 'You received an offer',
    body: `Good news! An employer sent you an offer on “${gig!.title}”.\nReview and accept if you’re interested.`,
    link: `${app}/applications/${appRow!.id}`,
    uniq_key: `offer_sent:${appRow!.id}`,
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
    body: `Your offer for “${gig!.title}” was accepted. You’re now hired!`,
    link: `${app}/gigs/${gig!.id}`,
    uniq_key: `offer_accepted:${appRow!.id}`,
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

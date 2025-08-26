import { test, expect } from '@playwright/test'
import { stubSignIn } from '../utils/session'
import { createClient } from '@supabase/supabase-js'

const app = process.env.PLAYWRIGHT_APP_URL!
const qa = process.env.QA_TEST_MODE === 'true'

const employerEmail = 'demo-user@quickgig.test'
const employerId = '00000000-0000-0000-0000-000000000001'
const workerId = '00000000-0000-0000-0000-000000000002'

test('@full hire requires tickets', async ({ page }) => {
  if (qa) await stubSignIn(page, employerEmail)

  const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })
  await supa.from('ticket_balances').upsert({ user_id: employerId, balance: 0 })
  const { data: gig } = await supa
    .from('gigs')
    .insert({ owner_id: employerId, title: 'Hire Test', description: 'hire', price: 1 })
    .select('id')
    .single()
  const { data: appRow } = await supa
    .from('applications')
    .insert({ gig_id: gig!.id, applicant_id: workerId, worker_id: workerId, status: 'pending' })
    .select('id')
    .single()

  await page.goto(`${app}/gigs/${gig!.id}/applicants`)
  page.on('dialog', d => d.accept())
  await page.getByTestId('hire-accept').click()
  await expect(page).toHaveURL(/\/pay$/)

  await supa.rpc('credit_tickets_admin', { p_user: employerId, p_tickets: 1, p_reason: 'test', p_ref: appRow!.id })
  await page.goto(`${app}/gigs/${gig!.id}/applicants`)
  await page.getByTestId('hire-accept').click()
  await expect(page.getByText(/status:\s*accepted/i)).toBeVisible()
})

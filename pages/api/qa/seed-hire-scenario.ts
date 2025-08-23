import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

function assertQA(req: NextApiRequest) {
  if (process.env.QA_TEST_MODE !== 'true') throw new Error('QA disabled')
  const ok = req.headers['x-qa-secret'] === process.env.QA_TEST_SECRET
  if (!ok) throw new Error('Unauthorized')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    assertQA(req)
    const { employerEmail, workerEmail } = req.body || {}
    if (!employerEmail || !workerEmail) return res.status(400).json({ error: 'emails required' })

    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only
    )

    // Upsert users + profiles
    const createUser = async (email: string) => {
      const { data: user } = await supa.auth.admin.getUserByEmail(email)
      let uid = user?.user?.id
      if (!uid) {
        const { data } = await supa.auth.admin.createUser({ email, email_confirm: true })
        uid = data.user?.id!
      }
      await supa.from('profiles').upsert({ id: uid, email, full_name: email.split('@')[0], is_admin: false })
      return uid!
    }

    const employerId = await createUser(employerEmail)
    const workerId = await createUser(workerEmail)

    // Make employer NOT admin and reset tickets to 0
    await supa.from('profiles').update({ is_admin: false }).eq('id', employerId)
    await supa.from('ticket_balances').upsert({ user_id: employerId, balance: 0 })

    // Create gig owned by employer
    const { data: gig } = await supa.from('gigs').insert({
      owner_id: employerId, title: 'Playwright E2E Gig', description: 'seeded',
      price: 123, tags: ['e2e'], location: 'remote'
    }).select().single()

    // Create application by worker (status: pending)
    const { data: app } = await supa.from('applications').insert({
      gig_id: gig!.id, applicant_id: workerId, status: 'pending'
    }).select().single()

    res.status(200).json({
      ok: true,
      employerId, workerId,
      gigId: gig!.id, applicationId: app!.id,
      hireUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/applications/${app!.id}`
    })
  } catch (e: any) {
    res.status(401).json({ ok: false, error: e?.message || 'error' })
  }
}


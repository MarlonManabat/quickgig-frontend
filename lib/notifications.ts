import 'server-only'
import { Resend } from 'resend'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const FROM = process.env.NOTIF_EMAIL_FROM || 'QuickGig <no-reply@quickgig.ph>'
const RESEND_API_KEY = process.env.RESEND_API_KEY
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_PORT = Number(process.env.SMTP_PORT || '587')
const SMTP_SECURE = (process.env.SMTP_SECURE || 'false') === 'true'

async function createSmtpTransport() {
  const mod = await import('nodemailer')
  return mod.default({
    host: SMTP_HOST!,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER!, pass: SMTP_PASS! }
  })
}

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (RESEND_API_KEY) {
    const resend = new Resend(RESEND_API_KEY)
    await resend.emails.send({ from: FROM, to, subject, html })
    return
  }
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const tx = await createSmtpTransport()
    await tx.sendMail({ from: FROM, to, subject, html })
    return
  }
  console.log('[notif/email disabled]', { to, subject })
}

export type NotifPayload = {
  userId: string
  email?: string
  type:
    | 'offer_sent'
    | 'offer_accepted'
    | 'job_completed'
    | 'gcash_approved'
    | 'gcash_rejected'
  title: string
  body: string
  link?: string
  uniq?: string
}

export async function emitNotification(p: NotifPayload) {
  if (process.env.NOTIFICATIONS_ENABLED !== 'true') return

  const supa: SupabaseClient<Database> = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: insErr } = await supa
    .from('notifications')
    .insert({
      user_id: p.userId,
      type: p.type,
      title: p.title,
      body: p.body,
      link: p.link,
      uniq_key: p.uniq || null
    })
    .select()
    .maybeSingle()

  if (
    insErr &&
    !(`${insErr.message}`.includes('duplicate key') ||
      `${insErr.details}`.includes('already exists'))
  ) {
    throw insErr
  }

  let to = p.email
  if (!to) {
    const { data: prof } = await supa
      .from('profiles')
      .select('email')
      .eq('id', p.userId)
      .maybeSingle()
    to = prof?.email || undefined
  }
  if (!to) {
    console.log('[notif]', p.type, '→', p.userId, '|', p.title)
    return
  }

  const subject = p.title
  const html = `
    <div style="font-family:ui-sans-serif,system-ui">
      <h2 style="margin:0 0 8px">QuickGig</h2>
      <p style="margin:0 0 12px;white-space:pre-line">${p.body}</p>
      ${p.link ? `<p><a href="${p.link}">Open in QuickGig →</a></p>` : ''}
      <hr/><small>This is an automated message from QuickGig.</small>
    </div>
  `

  await sendEmail({ to, subject, html })
}

export type NotifyEvent =
  | { type: 'job_posted'; jobId: string; actorUserId: string; targetUserIds: string[] }
  | {
      type: 'job_applied'
      jobId: string
      applicationId: string
      actorUserId: string
      targetUserIds: string[]
    }
  | {
      type: 'payment_approved'
      actorUserId: string
      targetUserId: string
      ticketsAdded: number
    }
  | {
      type: 'payment_rejected'
      actorUserId: string
      targetUserId: string
      reason?: string
    }

export async function sendNotification(evt: NotifyEvent): Promise<void> {
  switch (evt.type) {
    case 'job_posted': {
      const link = `${process.env.NEXT_PUBLIC_APP_URL}/gigs/${evt.jobId}`
      await Promise.all(
        evt.targetUserIds.map((uid) =>
          emitNotification({
            userId: uid,
            type: 'job_completed',
            title: 'New job posted',
            body: 'A new job was posted.',
            link
          })
        )
      )
      break
    }
    case 'job_applied': {
      const link = `${process.env.NEXT_PUBLIC_APP_URL}/applications/${evt.applicationId}`
      await Promise.all(
        evt.targetUserIds.map((uid) =>
          emitNotification({
            userId: uid,
            type: 'offer_sent',
            title: 'New application received',
            body: 'Someone applied to your job.',
            link
          })
        )
      )
      break
    }
    case 'payment_approved': {
      const link = `${process.env.NEXT_PUBLIC_APP_URL}/account/wallet`
      await emitNotification({
        userId: evt.targetUserId,
        type: 'gcash_approved',
        title: 'GCash top-up approved',
        body: `We added ${evt.ticketsAdded} ticket(s) to your balance. Salamat!`,
        link,
        uniq: `gcash_approved:${evt.actorUserId}:${evt.targetUserId}`
      })
      break
    }
    case 'payment_rejected': {
      const link = `${process.env.NEXT_PUBLIC_APP_URL}/account/wallet`
      const body = `We couldn't verify your GCash payment.${
        evt.reason ? ` Reason: ${evt.reason}` : ''
      }`
      await emitNotification({
        userId: evt.targetUserId,
        type: 'gcash_rejected',
        title: 'GCash top-up rejected',
        body,
        link,
        uniq: `gcash_rejected:${evt.actorUserId}:${evt.targetUserId}`
      })
      break
    }
  }
}

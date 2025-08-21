import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.RESEND_API_KEY && req.body?.to && req.body?.subject && req.body?.html) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM!,
        to: [req.body.to],
        subject: req.body.subject,
        html: req.body.html,
      }),
    })
    const data = await r.json()
    res.status(200).json({ ok: true, data })
  } else {
    res.status(200).json({ ok: false, skipped: true })
  }
}

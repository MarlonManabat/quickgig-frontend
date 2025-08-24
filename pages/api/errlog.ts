import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }
  const supa = createClient(env.supabaseUrl, env.serviceRole)
  const { message, stack, path } = (req.body || {}) as {
    message?: string
    stack?: string
    path?: string
  }
  try {
    await supa.from('client_errors').insert({
      message: message || '',
      stack_snippet: stack || null,
      path: path || null,
      ua: req.headers['user-agent'] || null,
      release: process.env.VERCEL_GIT_COMMIT_SHA || null,
    })
  } catch (e) {
    console.error('[errlog]', e)
  }
  res.status(200).json({ ok: true })
}

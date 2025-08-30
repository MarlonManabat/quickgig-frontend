import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export type ApiCtx = { req: NextApiRequest; res: NextApiResponse }

export async function requireUser(ctx: ApiCtx) {
  const supabase = createPagesServerClient<Database>({ req: ctx.req, res: ctx.res })
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    ctx.res.status(401).json({ error: 'unauthorized' })
    throw new Error('unauthorized')
  }
  return { supabase, user }
}

export function isAdmin(email?: string | null) {
  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
  return !!email && list.includes(email.toLowerCase())
}

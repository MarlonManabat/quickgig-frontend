import type { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return res.status(500).json({ ok:false, error:'Missing Supabase envs' })
  try {
    const r = await fetch(`${url}/rest/v1/`, {
      headers: { apikey:key, Authorization:`Bearer ${key}` }
    })
    return res.status(r.ok ? 200 : 500).json({ ok:r.ok })
  } catch (e:any) {
    return res.status(500).json({ ok:false, error:String(e?.message||e) })
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { normalizeJobPost } from '../../src/lib/postJob';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });
  try {
    const payload = normalizeJobPost(req.body);
    const url = process.env.POST_JOB_WEBHOOK_URL;
    if (!url) {
      // Accept locally without forwarding (useful in dev/preview)
      return res.status(202).json({ ok:true, forwarded:false, payloadSummary:{ title: payload.title, tags: payload.tags?.slice(0,6) }});
    }
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify({ source:'quickgig.ph', kind:'job_post', at: new Date().toISOString(), payload }),
    });
    const ok = r.ok;
    const status = r.status;
    const text = await r.text().catch(()=> '');
    return res.status(ok ? 200 : 502).json({ ok, forwarded:true, status, body: text.slice(0,2000) });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return res.status(400).json({ ok:false, error: message });
  }
}

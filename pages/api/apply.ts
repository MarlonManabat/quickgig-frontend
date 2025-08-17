import type { NextApiRequest, NextApiResponse } from 'next';
import { UploadedFile } from '@/types/upload';

type ApplyPayload = {
  jobId: string;
  name: string;
  email: string;
  message?: string;
  resumeUrl?: string;
  resume?: UploadedFile; // legacy shape
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method Not Allowed' });
  try {
    const payload = req.body as ApplyPayload;
    if (!payload?.jobId || !payload?.name || !payload?.email)
      return res.status(400).json({ ok:false, error:'Missing fields' });
    const { resume, ...rest } = payload;
    const legacy = resume as undefined | { url?: string; data?: string };
    const resumeUrl = payload.resumeUrl || legacy?.url || legacy?.data;
    const body = { ...rest, resumeUrl };
    const url = process.env.APPLY_WEBHOOK_URL;
    if (url) {
      const r = await fetch(url, {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({ source:'quickgig-frontend', ...body }),
      });
      // tolerate non-2xx: still report accepted to not block UX
      return res.status(202).json({ ok:true, forwarded: r.ok });
    }
    // No webhook configured — accept locally
    return res.status(202).json({ ok:true, forwarded:false });
  } catch (e: unknown) {
    return res.status(500).json({ ok:false, error: e instanceof Error ? e.message : String(e) });
  }
}

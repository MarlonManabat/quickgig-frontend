import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminToken = process.env.ADMIN_TASK_TOKEN;
  const token = req.headers['authorization']?.split('Bearer ')[1];
  if (!adminToken || token !== adminToken) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  if (!url || !serviceRole) {
    res.status(500).json({ error: 'Missing envs' });
    return;
  }
  const supabase = createClient(url, serviceRole);
  for (const id of ['avatars', 'payment-proofs']) {
    await supabase.storage.createBucket(id, { public: true }).catch(() => {});
  }
  res.json({ ok: true });
}

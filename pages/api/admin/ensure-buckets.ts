import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminToken = process.env.ADMIN_TASK_TOKEN;

const supabase = createClient(url, serviceRole);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers['authorization']?.split('Bearer ')[1];
  if (!adminToken || token !== adminToken) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  for (const id of ['avatars', 'payment-proofs']) {
    await supabase.storage.createBucket(id, { public: true }).catch(() => {});
  }

  res.json({ ok: true });
}

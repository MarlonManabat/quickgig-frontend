import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.VERCEL_ENV !== 'preview') {
    return res.status(403).end('forbidden');
  }
  const token = req.headers.authorization?.replace('Bearer ', '') || '';
  if (!process.env.QA_TEST_SECRET || token !== process.env.QA_TEST_SECRET) {
    return res.status(403).end('forbidden');
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return res.status(500).end('missing supabase env');
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? process.env.QA_TEST_EMAIL ?? 'admin@preview.test';
  const profile = {
    id: '00000000-0000-0000-0000-000000000000',
    email: adminEmail,
    full_name: 'Preview Admin',
    role: 'admin',
    is_admin: true,
    can_post: true,
  };
  await supabase.from('profiles').upsert(profile, { onConflict: 'id' });
  res.status(200).json({ ok: true });
}

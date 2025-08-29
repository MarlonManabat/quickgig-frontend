import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production' && req.method !== 'POST') return res.status(405).end();

  const email = process.env.SEED_ADMIN_EMAIL;
  if (!email) return res.status(200).json({ ok: true, note: 'SEED_ADMIN_EMAIL not set' });

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: user, error: uerr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (uerr) return res.status(400).json({ error: uerr.message });

  const target = user.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (!target) return res.status(200).json({ ok: true, note: 'user not found yet' });

  await admin.from('profiles').upsert({ id: target.id, role: 'admin' }, { onConflict: 'id' });
  return res.status(200).json({ ok: true });
}


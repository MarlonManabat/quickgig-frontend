import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Database, Insert } from '@/types/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production' && req.method !== 'POST') return res.status(405).end();
  const email = process.env.SEED_ADMIN_EMAIL;
  if (!email) return res.status(200).json({ ok: true, note: 'SEED_ADMIN_EMAIL not set' });

  const admin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
  const { data: users, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) return res.status(400).json({ error: error.message });

  const u = users.users.find(x => x.email?.toLowerCase() === email.toLowerCase());
  if (!u) return res.status(200).json({ ok: true, note: 'user not found yet (sign in first)' });

  await admin
    .from('profiles')
    .upsert([
      { id: u.id, role: 'admin' } satisfies Insert<'profiles'>,
    ], { onConflict: 'id' });
  return res.status(200).json({ ok: true });
}

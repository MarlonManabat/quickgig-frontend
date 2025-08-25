import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

async function ensureBuckets(supabase: SupabaseClient<any, any, any>) {
  const { data } = await supabase.storage.listBuckets();
  for (const b of ['avatars', 'payment-proofs']) {
    if (!data?.find((x) => x.name === b)) {
      await supabase.storage.createBucket(b, { public: true });
    }
  }
}

async function seedProfiles(supabase: SupabaseClient<any, any, any>) {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'demo-admin@quickgig.test';
  const profiles = [
    { id: '00000000-0000-0000-0000-000000000001', email: 'demo-user@quickgig.test', full_name: 'Demo User', role: 'user', is_admin: false, can_post: false },
    { id: '00000000-0000-0000-0000-000000000002', email: 'new-user@quickgig.test', full_name: 'New User', role: 'user', is_admin: false, can_post: false },
    { id: '00000000-0000-0000-0000-000000000003', email: adminEmail, full_name: 'Demo Admin', role: 'admin', is_admin: true, can_post: true },
  ];
  for (const p of profiles) {
    await supabase.from('profiles').upsert(p, { onConflict: 'id' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.QA_TEST_MODE !== 'true') return res.status(404).end('Not Found');
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    await ensureBuckets(supabase);
    await seedProfiles(supabase);

    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

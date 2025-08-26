import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  if (req.headers['x-test-secret'] !== process.env.QA_TEST_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const supa: SupabaseClient<Database> = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // deterministic ids for tests
  const employerId = '00000000-0000-0000-0000-000000000001';
  const workerId = '00000000-0000-0000-0000-000000000002';

  await supa.from('ticket_balances').delete().eq('user_id', employerId);
  await supa.from('applications').delete().eq('applicant_id', workerId);
  await supa.from('messages').delete().eq('sender_id', workerId);
  await supa.from('notifications').delete().in('user_id', [employerId, workerId]);

  const { data: gig } = await supa
    .from('gigs')
    .insert({ owner_id: employerId, title: 'Seed Gig', description: 'seed', price: 1 })
    .select('id')
    .single();

  const { data: appRow } = await supa
    .from('applications')
    .insert({ gig_id: gig!.id, applicant_id: workerId, worker_id: workerId, status: 'pending' })
    .select('id')
    .single();

  res.status(200).json({ gigId: gig?.id, applicationId: appRow?.id });
}

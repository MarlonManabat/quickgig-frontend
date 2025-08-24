import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

function assertQA(req: NextApiRequest) {
  if (process.env.QA_TEST_MODE !== 'true') throw new Error('QA disabled');
  const ok = req.headers['x-qa-secret'] === process.env.QA_TEST_SECRET;
  if (!ok) throw new Error('Unauthorized');
}

async function findUserId(supa: any, email: string): Promise<string> {
  const { data } = await supa.from('profiles').select('id').eq('email', email).single();
  if (data?.id) return data.id;
  let page = 1;
  const perPage = 200;
  while (true) {
    const { data: list, error } = await supa.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = list.users.find((u: any) => (u.email || '').toLowerCase() === email.toLowerCase());
    if (match) return match.id;
    if (list.users.length < perPage) break;
    page += 1;
  }
  throw new Error(`User not found: ${email}`);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    assertQA(req);
    const { email, amount } = req.body || {};
    if (!email || typeof amount !== 'number') return res.status(400).json({ error: 'email and amount required' });
    const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const id = await findUserId(supa, email);
    await supa.rpc('credit_tickets_admin', {
      p_user: id,
      p_tickets: amount,
      p_reason: 'qa_grant',
      p_ref: null,
    });
    const { data: bal } = await supa
      .from('ticket_balances')
      .select('balance')
      .eq('user_id', id)
      .single();
    res.status(200).json({ balance: bal?.balance ?? 0 });
  } catch (e: any) {
    res.status(401).json({ ok: false, error: e?.message || 'error' });
  }
}


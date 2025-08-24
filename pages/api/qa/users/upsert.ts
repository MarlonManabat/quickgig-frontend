import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

function assertQA(req: NextApiRequest) {
  if (process.env.QA_TEST_MODE !== 'true') throw new Error('QA disabled');
  const ok = req.headers['x-qa-secret'] === process.env.QA_TEST_SECRET;
  if (!ok) throw new Error('Unauthorized');
}

async function getOrCreateUser(supa: any, email: string): Promise<string> {
  // Attempt to create user; if exists, fall back to search
  const created = await supa.auth.admin.createUser({ email, email_confirm: true }).catch(() => null);
  if (created?.data?.user?.id) {
    const uid = created.data.user.id;
    await supa.from('profiles').upsert({
      id: uid,
      email,
      full_name: email.split('@')[0],
      is_admin: false,
    });
    return uid;
  }

  // Search existing users via listUsers
  let page = 1;
  const perPage = 200;
  while (true) {
    const { data, error } = await supa.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = data.users.find((u: any) => (u.email || '').toLowerCase() === email.toLowerCase());
    if (match) {
      const uid = match.id;
      await supa.from('profiles').upsert({
        id: uid,
        email,
        full_name: email.split('@')[0],
        is_admin: false,
      });
      return uid;
    }
    if (data.users.length < perPage) break;
    page += 1;
  }
  throw new Error(`Could not create or find user for ${email}`);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.QA_ENABLED !== 'true') return res.status(404).end('Not Found');
  try {
    assertQA(req);
    const { email, role, tickets } = req.body || {};
    if (!email || !role) return res.status(400).json({ error: 'email and role required' });

    const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const id = await getOrCreateUser(supa, email);

    if (typeof tickets === 'number' && tickets > 0) {
      await supa.rpc('credit_tickets_admin', {
        p_user: id,
        p_tickets: tickets,
        p_reason: 'qa_seed',
        p_ref: null,
      });
    }

    const { data: bal } = await supa
      .from('ticket_balances')
      .select('balance')
      .eq('user_id', id)
      .single();

    res.status(200).json({ id, email, tickets: bal?.balance ?? 0 });
  } catch (e: any) {
    res.status(401).json({ ok: false, error: e?.message || 'error' });
  }
}


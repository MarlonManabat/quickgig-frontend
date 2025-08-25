import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

function assertAuth(req: NextApiRequest) {
  const enabled = process.env.QA_TEST_MODE === 'true';
  const okHeader = req.headers['x-test-secret'] === process.env.QA_TEST_SECRET;
  if (!enabled) throw new Error('disabled');
  if (!okHeader) throw new Error('unauthorized');
}

async function deleteAllUsers(supabase: ReturnType<typeof createClient>) {
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    for (const u of data.users) {
      await supabase.auth.admin.deleteUser(u.id);
    }
    if (data.users.length < 1000) break;
    page += 1;
  }
}

async function createUser(
  supabase: ReturnType<typeof createClient>,
  email: string,
  profile: Record<string, any>
) {
  const created = await supabase.auth.admin.createUser({ email, email_confirm: true }).catch(() => null);
  let id = created?.data?.user?.id;
  if (!id) {
    let page = 1;
    const perPage = 200;
    while (!id) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) throw error;
      const found = data.users.find((u) => (u.email ?? '').toLowerCase() === email.toLowerCase());
      if (found) {
        id = found.id;
        break;
      }
      if (data.users.length < perPage) break;
      page += 1;
    }
    if (!id) throw new Error(`user not found: ${email}`);
  }
  await supabase.from('profiles').upsert({ id, email, ...profile });
  return id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    assertAuth(req);
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // clean reset
    await supabase.from('notifications').delete().neq('id', 0);
    await supabase.from('message_reads').delete().neq('application_id', 0);
    await supabase.from('messages').delete().neq('id', 0);
    await supabase.from('applications').delete().neq('id', 0);
    await supabase.from('gigs').delete().neq('id', 0);
    await supabase.from('ticket_ledger').delete().neq('id', 0);
    await supabase.from('ticket_balances').delete().neq('user_id', '00000000-0000-0000-0000-000000000000');
    await deleteAllUsers(supabase);

    // fixtures
    const adminEmail = process.env.SEED_ADMIN_EMAIL!;
    const employerEmail = 'demo-user@quickgig.test';
    const workerEmail = 'new-user@quickgig.test';

    const adminId = await createUser(supabase, adminEmail, {
      full_name: 'Admin',
      first_name: 'Admin',
      city: 'Metro',
      role_pref: 'employer',
      is_admin: true,
    });

    const employerId = await createUser(supabase, employerEmail, {
      full_name: 'Employer',
      first_name: 'Employer',
      city: 'Metro',
      role_pref: 'employer',
      is_admin: false,
    });

    const workerId = await createUser(supabase, workerEmail, {
      full_name: 'Worker',
      first_name: 'Worker',
      city: 'Metro',
      role_pref: 'worker',
      is_admin: false,
    });

    const { data: gig } = await supabase
      .from('gigs')
      .insert({
        owner_id: employerId,
        title: 'Seed Gig',
        description: 'seeded',
        price: 100,
        tags: ['seed'],
        is_remote: true,
      })
      .select('id')
      .single();

    const { data: app } = await supabase
      .from('applications')
      .insert({
        gig_id: gig!.id,
        applicant_id: workerId,
        status: 'pending',
      })
      .select('id')
      .single();

    res.status(200).json({ ok: true, gigId: gig!.id, applicationId: app!.id, employerId, workerId, adminId });
  } catch (e: any) {
    const msg = e?.message || 'error';
    const status = msg === 'unauthorized' ? 401 : msg === 'disabled' ? 404 : 500;
    res.status(status).json({ ok: false, error: msg });
  }
}

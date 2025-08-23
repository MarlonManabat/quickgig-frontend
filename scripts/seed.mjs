import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// If we don't have credentials (e.g., PRs), exit successfully so CI doesn't fail.
if (!url || !key) {
  console.log('[seed] skipping: SUPABASE_URL / key not provided');
  process.exit(0);
}

const supabase = createClient(url, key);

// helper: returns first row or null
async function first(table) {
  const { data } = await supabase.from(table).select('*').limit(1);
  return (data && data[0]) || null;
}

(async () => {
  // demo user & profile
  const demoEmail = process.env.SEED_DEMO_EMAIL || 'demo@example.com';
  try {
    const { data: existing } = await supabase.auth.admin.getUserByEmail(demoEmail);
    let demo = existing?.user;
    if (!demo) {
      const { data } = await supabase.auth.admin.createUser({ email: demoEmail, email_confirm: true });
      demo = data.user;
      console.log('[seed] created demo user:', demoEmail);
    }
    if (demo) {
      await supabase.from('profiles').upsert(
        {
          id: demo.id,
          full_name: '',
          role: 'user',
          can_post_job: false,
          is_admin: false,
        },
        { onConflict: 'id', ignoreDuplicates: true }
      );
    }
  } catch (err) {
    console.log('[seed] demo user skipped:', err.message);
  }

  // demo gig
  if (!(await first('gigs'))) {
    await supabase.from('gigs').insert({ title: 'Demo Gig', description: 'Seeded', owner: 'seed-owner' });
  }
  // demo application
  if (!(await first('applications'))) {
    const { data: g } = await supabase.from('gigs').select('id').limit(1);
    if (g?.[0]) await supabase.from('applications').insert({ gig_id: g[0].id, applicant: 'seed-applicant' });
  }
  // demo thread+message
  if (!(await first('messages'))) {
    await supabase.from('messages').insert({ thread_id: '00000000-0000-0000-0000-000000000000', sender_id: 'seed', body: 'hello' });
  }
  // mark admin
  const adminEmail = process.env.SEED_ADMIN_EMAIL || process.env.ADMIN_EMAILS?.split(',')[0];
  if (adminEmail) {
    await supabase.from('profiles').update({ is_admin: true }).eq('email', adminEmail.trim());
    console.log('[seed] marked admin:', adminEmail);
  }
  console.log('[seed] done');
})();


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
  console.log('[seed] done');
})();


import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminEmail = process.env.SEED_ADMIN_EMAIL ?? process.env.QA_TEST_EMAIL ?? 'admin@preview.test';

async function run() {
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const profile = {
    id: '00000000-0000-0000-0000-000000000000',
    email: adminEmail,
    full_name: 'Preview Admin',
    role: 'admin',
    is_admin: true,
    can_post: true,
  };
  await supabase.from('profiles').upsert(profile, { onConflict: 'id' });
  console.log('seeded preview');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminEmail = process.env.SEED_ADMIN_EMAIL!;

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function upsertProfiles() {
  const profiles = [
    {
      email: 'demo-user@quickgig.test',
      full_name: 'Demo User',
      is_admin: false,
      can_post: false,
    },
    {
      email: adminEmail,
      full_name: 'Demo Admin',
      is_admin: true,
      can_post: true,
    },
  ];
  for (const p of profiles) {
    await supabase.from('profiles').upsert(p, { onConflict: 'email' });
  }
}

async function upsertGigs(ownerEmail: string) {
  const { data: owner } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', ownerEmail)
    .single();
  const ownerId = owner?.id ?? ownerEmail;
  const gigs = [
    { id: '00000000-0000-0000-0000-000000000010', title: 'Sample Gig A', description: 'Seeded gig', owner: ownerId },
    { id: '00000000-0000-0000-0000-000000000011', title: 'Sample Gig B', description: 'Seeded gig', owner: ownerId },
  ];
  for (const g of gigs) {
    await supabase.from('gigs').upsert(g, { onConflict: 'id' });
  }
}

(async () => {
  await upsertProfiles();
  await upsertGigs(adminEmail);
  console.log('Seed demo completed');
})();

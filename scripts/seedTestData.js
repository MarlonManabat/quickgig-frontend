const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE;

if (!url || !serviceKey) {
  console.log('Missing Supabase env vars, skipping seed');
  process.exit(0);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function seed() {
  const profiles = [
    { email: 'e2e-employer@example.com', full_name: 'E2E Employer', can_post: true },
    { email: 'e2e-worker@example.com', full_name: 'E2E Worker', can_post: false }
  ];
  for (const profile of profiles) {
    await supabase.from('profiles').upsert(profile, { onConflict: 'email' });
  }

  const { data: owner } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', profiles[0].email)
    .single();
  const ownerId = owner?.id;

  const gigs = [
    {
      id: '00000000-0000-0000-0000-000000000100',
      title: 'Test Gig',
      description: 'Seeded gig for E2E tests',
      owner: ownerId
    }
  ];
  for (const gig of gigs) {
    await supabase.from('gigs').upsert(gig, { onConflict: 'id' });
  }

  console.log('Seed test data done');
}

seed().catch((err) => {
  console.error('Failed to seed data', err);
  process.exit(1);
});

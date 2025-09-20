import { createClient } from '@supabase/supabase-js';

import { demoJobs } from '../data/demo-jobs';

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    console.log('Supabase env not configured; skipping seed.');
    return;
  }

  const client = createClient(url, serviceRole, {
    auth: { persistSession: false },
  });

  const { error } = await client.from('jobs').upsert(
    demoJobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      region: job.region,
      city: job.city,
      published: true,
    })),
    { onConflict: 'id' }
  );

  if (error) {
    console.error('Failed to seed jobs', error);
    process.exitCode = 1;
    return;
  }

  console.log(`Seeded ${demoJobs.length} demo jobs.`);
}

main();

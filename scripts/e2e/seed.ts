import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supa = createClient(url, service);

async function main() {
  const employer = 'e2e+employer@example.com';
  const worker = 'e2e+worker@example.com';
  const admin = 'e2e+admin@example.com';
  const password = 'test-password-123';

  for (const email of [employer, worker, admin]) {
    await supa.auth.admin
      .createUser({ email, password, email_confirm: true })
      .catch(() => {});
  }

  const { data: users } = await supa
    .from('profiles')
    .select('id,email')
    .in('email', [employer, worker, admin]);

  const employerId = users?.find((u) => u.email === employer)?.id;

  if (users?.length) {
    const rows = users.map((u) => ({ id: u.id, role: u.email === admin ? 'admin' : u.email === employer ? 'employer' : 'worker', tickets: 3 }));
    await supa.from('profiles').upsert(rows);
  }

  if (employerId) {
    await supa.from('gigs').upsert([
      {
        id: '00000000-0000-0000-0000-00000000e2e1',
        employer_id: employerId,
        title: 'Seeded E2E Gig',
        description: 'Seeded gig for tests',
        region_code: '130000000',
        city_code: '137401000',
        budget: 1000,
      },
    ]);
  }

  console.log('Seed complete');
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});

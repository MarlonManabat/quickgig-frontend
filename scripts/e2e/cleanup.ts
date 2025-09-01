import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supa = createClient(url, service);

async function main() {
  await supa.from('gig_applications').delete().eq('gig_id', '00000000-0000-0000-0000-00000000e2e1');
  await supa.from('gigs').delete().eq('id', '00000000-0000-0000-0000-00000000e2e1');
  console.log('Cleanup complete');
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});

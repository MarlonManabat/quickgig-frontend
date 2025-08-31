import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE;
const supa = createClient(url, service);
const sample = [
  { title: 'Design a logo', description: 'Need a modern logo for a cafe', city: 'Manila', budget: 1500, status: 'open', published: true, owner: 'stub-owner' },
  { title: 'React landing page', description: 'One page site, Tailwind + Next', city: 'Cebu', budget: 5000, status: 'open', published: true, owner: 'stub-owner' },
];
await supa.from('gigs').insert(sample);
console.log('Seeded gigs:', sample.length);

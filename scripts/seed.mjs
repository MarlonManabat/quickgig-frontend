import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function tableNotEmpty(table) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count > 0;
}

async function ensureUser(email, password, fullName) {
  let { data: userData, error } = await supabase.auth.admin.getUserByEmail(email);
  if (error) throw error;
  let user = userData.user;
  if (!user) {
    const { data, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (createError) throw createError;
    user = data.user;
  }
  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    full_name: fullName,
    can_post_job: true
  });
  if (profileError) throw profileError;
  return user;
}

async function main() {
  const tables = ['profiles', 'gigs', 'applications', 'threads', 'messages'];
  for (const table of tables) {
    if (await tableNotEmpty(table)) {
      console.log(`${table} already has data, skipping seed`);
      return;
    }
  }

  const user = await ensureUser('qa@example.com', 'password', 'QA User');

  const { data: gig, error: gigError } = await supabase.from('gigs').insert({
    owner: user.id,
    title: 'Sample Gig',
    description: 'Seed gig',
    budget: 100,
    location: 'Remote',
    status: 'published',
    paid: true
  }).select().single();
  if (gigError) throw gigError;

  const { data: application, error: appError } = await supabase.from('applications').insert({
    gig_id: gig.id,
    applicant: user.id,
    cover_letter: 'Seed application'
  }).select().single();
  if (appError) throw appError;

  const { data: thread, error: threadError } = await supabase.from('threads').insert({
    application_id: application.id
  }).select().single();
  if (threadError) throw threadError;

  const { error: msgError } = await supabase.from('messages').insert({
    thread_id: thread.id,
    sender: user.id,
    body: 'Seed message'
  });
  if (msgError) throw msgError;

  console.log('Seed data inserted');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const requiredKey = process.env.E2E_KEY;
  if (requiredKey && req.headers.get('x-e2e-key') !== requiredKey) return new Response(null, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const role = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !role) return new Response(null, { status: 204 });

  const supabase = createClient(url, role, { auth: { persistSession: false } });

  const employerEmail = process.env.E2E_EMPLOYER_EMAIL || 'e2e-employer@quickgig.ph';
  const workerEmail = process.env.E2E_WORKER_EMAIL || 'e2e-worker@quickgig.ph';
  const passwd = process.env.E2E_PASSWORD || 'E2e!Pass123';

  try { await supabase.auth.admin.createUser({ email: employerEmail, password: passwd, email_confirm: true }); } catch {}
  try { await supabase.auth.admin.createUser({ email: workerEmail, password: passwd, email_confirm: true }); } catch {}

  const { data: users } = await supabase
    .from('users')
    .select('id,email')
    .in('email', [employerEmail, workerEmail]);

  const employer_id = users?.find((u) => u.email === employerEmail)?.id;
  const worker_id = users?.find((u) => u.email === workerEmail)?.id;

  if (employer_id || worker_id) {
    await supabase
      .from('profiles')
      .upsert([
        employer_id ? { user_id: employer_id, role: 'employer', tickets: 3 } : undefined,
        worker_id ? { user_id: worker_id, role: 'worker', tickets: 3 } : undefined,
      ].filter(Boolean) as any);
  }

  return Response.json({ ok: true, employer_id, worker_id });
}

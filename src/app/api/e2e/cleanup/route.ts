import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const requiredKey = process.env.E2E_KEY;
  if (requiredKey && req.headers.get('x-e2e-key') !== requiredKey) return new Response(null, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const role = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !role) return new Response(null, { status: 204 });

  const supabase = createClient(url, role, { auth: { persistSession: false } });

  try { await supabase.from('applications').delete().eq('tag', 'e2e'); } catch {}
  try { await supabase.from('gigs').delete().eq('tag', 'e2e'); } catch {}
  try { await supabase.from('threads').delete().eq('tag', 'e2e'); } catch {}

  return Response.json({ ok: true });
}

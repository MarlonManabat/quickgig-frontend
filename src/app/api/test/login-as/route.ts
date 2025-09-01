// Enable only when CI_ALLOW_TEST_ENDPOINTS=1 (never set in prod)
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  if (process.env.CI_ALLOW_TEST_ENDPOINTS !== '1') {
    return new NextResponse('disabled', { status: 404 });
  }

  const { role } = await req.json().catch(() => ({} as any));
  if (!role) return NextResponse.json({ error: 'role required' }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supa = createClient(url, service);

  // create or upsert test users per role with known passwords
  const email = `e2e+${role}@example.com`;
  const password = 'test-password-123';
  await supa.auth.admin
    .createUser({
      email,
      password,
      email_confirm: true,
    })
    .catch(() => {});

  // Create a session cookie via password sign-in (client key)
  const client = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session)
    return NextResponse.json(
      { error: error?.message ?? 'login failed' },
      { status: 500 }
    );

  // Return bearer token for Playwright to set cookie via app
  return NextResponse.json({ access_token: data.session.access_token, email });
}

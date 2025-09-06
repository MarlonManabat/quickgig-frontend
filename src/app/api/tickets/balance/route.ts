import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const hasSupabaseEnv =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const MOCK_MODE =
  process.env.MOCK_MODE === '1' ||
  process.env.CI === 'true' ||
  !hasSupabaseEnv;

export function createSb() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, opts) => cookieStore.set({ name, value, ...opts }),
        remove: (name, opts) =>
          cookieStore.set({ name, value: '', ...opts, maxAge: 0 }),
      },
    }
  );
}

export async function GET() {
  if (MOCK_MODE) {
    return NextResponse.json({ balance: 0, source: 'ci-mock' });
  }

  const supa = createSb();

  try {
    const { data: auth } = await supa.auth.getUser();
    const uid = auth?.user?.id;
    if (!uid) return NextResponse.json({ balance: 0 });

    let balance = 0;
    const rpc = await supa.rpc('tickets_balance', { p_user: uid } as any);
    if (!rpc.error && typeof rpc.data === 'number') balance = rpc.data;
    else {
      const res = await supa
        .from('ticket_ledger')
        .select('delta')
        .eq('user_id', uid)
        .limit(1000);
      if (!res.error && res.data)
        balance = res.data.reduce((a, r: any) => a + (r.delta || 0), 0);
    }
    return NextResponse.json({ balance });
  } catch {
    return NextResponse.json({ balance: 0, source: 'fallback' });
  }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

export async function GET() {
  if (MOCK_MODE) {
    return NextResponse.json({ balance: 0, source: 'ci-mock' });
  }

  const { createServerClient } = await import('@supabase/ssr');
  const cookieStore = cookies();
  const supa = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    const { data: auth } = await supa.auth.getUser();
    const uid = auth?.user?.id;
    if (!uid) return NextResponse.json({ balance: 0 });

    let balance = 3; // Default 3 free tickets for new users
    const rpc = await supa.rpc('tickets_balance', { p_user: uid } as any);
    if (!rpc.error && typeof rpc.data === 'number') balance = rpc.data;
    else {
      const res = await supa
        .from('ticket_ledger')
        .select('delta')
        .eq('user_id', uid)
        .limit(1000);
      if (!res.error && res.data) {
        const calculatedBalance = res.data.reduce((a, r: any) => a + (r.delta || 0), 0);
        balance = calculatedBalance > 0 ? calculatedBalance : 3; // Ensure minimum 3 tickets
      }
    }
    return NextResponse.json({ balance });
  } catch {
    return NextResponse.json({ balance: 0, source: 'fallback' });
  }
}

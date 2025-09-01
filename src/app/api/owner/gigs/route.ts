import { NextResponse } from 'next/server';
import { publicSupabase } from '@/lib/supabase/server';
import { listGigs } from '@/lib/mock/owner';
import type { OwnerGigRow } from '@/types/owner';

export const runtime = 'nodejs';

export async function GET() {
  const uid = 'stub-owner';
  const supa = await publicSupabase();
  if (!supa) {
    const items = listGigs(uid);
    return NextResponse.json({ items });
  }
  try {
    const { data, error } = await supa
      .from('gigs')
      .select('id,title,city,budget,status,created_at')
      .eq('owner', uid);
    if (error) throw error;
    return NextResponse.json({ items: (data as OwnerGigRow[]) ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'Unexpected error' },
      { status: 500 },
    );
  }
}

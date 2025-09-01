import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import type { OwnerGigRow } from '@/types/owner';

export const runtime = 'nodejs';

export async function GET() {
  const uid = 'stub-owner';
  const supa = getSupabaseServer();
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

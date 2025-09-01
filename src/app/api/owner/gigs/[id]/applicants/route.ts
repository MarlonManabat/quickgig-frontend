import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import type { ApplicantRow } from '@/types/owner';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const gigId = params.id;
  const supa = getServerSupabase();
  try {
    const { data, error } = await supa
      .from('gig_applications')
      .select('id,applicant,created_at,status')
      .eq('gig_id', gigId);
    if (error) throw error;
    return NextResponse.json({ items: (data as ApplicantRow[]) ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'Unexpected error' },
      { status: 500 },
    );
  }
}

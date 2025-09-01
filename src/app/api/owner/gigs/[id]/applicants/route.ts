import { NextResponse } from 'next/server';
import { publicSupabase } from '@/lib/supabase/server';
import { listApplicants } from '@/lib/mock/owner';
import type { ApplicantRow } from '@/types/owner';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const gigId = params.id;
  const supa = await publicSupabase();
  if (!supa) {
    const items = listApplicants(gigId);
    return NextResponse.json({ items });
  }
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

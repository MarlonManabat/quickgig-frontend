import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import type { GigDetail } from '@/types/gigs';

export const runtime = 'nodejs';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supa = getServerSupabase();
  const { data, error } = await supa
    .from('gigs')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ gig: data as GigDetail });
}

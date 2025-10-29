import { NextResponse } from 'next/server';
import { publicSupabase } from '@/lib/supabase/server';
import { gigById } from '@/lib/mock/gigs';
import type { GigDetail } from '@/types/gigs';

export const runtime = 'nodejs';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    let supa = null;
    try {
      supa = await publicSupabase();
    } catch (error) {
      console.error('[API /gigs/[id]] Supabase connection error:', error);
      supa = null;
    }
    
    if (!supa) {
      console.log('[API /gigs/[id]] Using mock data for:', id);
      const gig = gigById(id);
      if (!gig) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ gig });
    }
    
    try {
      const { data, error } = await supa
        .from('gigs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        throw error;
      }
      
      return NextResponse.json({ gig: data as GigDetail });
    } catch (dbError) {
      console.error('[API /gigs/[id]] Database error, falling back to mock:', dbError);
      const gig = gigById(id);
      if (!gig) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ gig });
    }
  } catch (error) {
    console.error('[API /gigs/[id]] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

